package nuls.contract;

import io.nuls.contract.sdk.Address;
import io.nuls.contract.sdk.Contract;
import io.nuls.contract.sdk.Msg;
import io.nuls.contract.sdk.annotation.View;
import org.checkerframework.dataflow.qual.Pure;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

import static io.nuls.contract.sdk.Utils.require;

/*
* 该合约是uniswap的配对合约，由工厂合约创建，周边合约调用
* */
public  class iSwapPair extends iSwapToken implements Contract {

    private  final BigInteger MINIMUM_LIQUIDIY = BigInteger.valueOf(1000);

    public Address factory;
    public Address token0;
    public Address token1;

    private BigInteger reserve0;
    private BigInteger reserve1;
    private BigInteger blockTimestampLast;
    private BigInteger totalSupply;
    private Map<String,BigInteger>reserve = new HashMap<String, BigInteger>();

    public BigInteger price0ClumlastiveLast;
    public BigInteger price1CumulativeLast;
    public BigInteger kLast;

    private boolean unlocked = true;

    private  iSwapToken _iSwapToken;
    //Event Mint(Address indexed sender, BigInteger amount0, BigInteger amount1);

    public iSwapPair(Address _factory){
        super("liquitiy_token","lpt",BigInteger.valueOf(1),8);
        //初始化变量的值
        factory = _factory;
        reserve0 = BigInteger.valueOf(0);
        reserve1 = BigInteger.valueOf(0);
        kLast = BigInteger.valueOf(0);
    }

//    得到储存值,初步版本时间戳未设置
    @View
    public HashMap getReserves(){
        reserve.put("reserve0",reserve0);
        reserve.put("reserve1",reserve1);
        return (HashMap) reserve;
    }

    //仅前期做测试看下初试化合约成功没有
    @View
    public HashMap getTokens(){
        HashMap hashMap = new HashMap();
        hashMap.put("tokenA",token0);
        hashMap.put("tokenB",token1);
        return hashMap;
    }

    //供iSwapLiquidityMathLibrary功能类调用,方便流动性计算
    @Pure
    public BigInteger getkLast(){
        return kLast;
    }

    //仅被工厂合约一次性调用
    public void initialize(Address _token0,Address _token1){
        require(factory.toString().equals(Msg.sender().toString()),"iSwap:FORBIDDEN");
        token0 = _token0;
        token1 = _token1;
    }

    @Pure
    private  BigInteger min(BigInteger x,BigInteger y){
        return x.compareTo(y)<0 ? x: y;
    }

    private void Locked(){
        require(unlocked==true,"LOCKED");
        unlocked = false;
    }

    @Pure
    public static BigInteger sqrt(BigInteger y) {
        BigInteger z = null;
        if (y.compareTo(BigInteger.valueOf(3))>0) {
            z = y;
            BigInteger x = y.divide(BigInteger.valueOf(2)).add(BigInteger.valueOf(1));
            while (x.compareTo(z)<0) {
                z = x;
                x = (y.divide(x).add(x)).divide(BigInteger.valueOf(2));
            }
        } else if (!(y.compareTo(BigInteger.valueOf(0))==0)){
            z = BigInteger.valueOf(1);
        }
        return z;
    }

    public void swap(BigInteger amount0Out,BigInteger amount1Out,Address to){
        Locked();
        require(amount0Out.compareTo(BigInteger.valueOf(0))>=0||amount1Out.compareTo(BigInteger.valueOf(0))>=0,"iSwap: INSUFFICIENT_LIQUIDITY");
        Map<String,BigInteger> reserve = getReserves();
        BigInteger balance0;
        BigInteger balance1;
        Address _token0 = token0;
        Address _token1 = token1;

        require(to.toString().equals(_token0.toString())==false&&to.toString().equals(_token1.toString())==false,"iSwap: INVALID_TO");
        if(amount0Out.compareTo(BigInteger.valueOf(0))>0){
            String[][] args = new String[2][];
            args[0] = new String[]{String.valueOf(to)};
            args[1] = new String[]{String.valueOf(amount0Out)};
            _token0.call("transfer","",args,BigInteger.ZERO);
        }

        if(amount1Out.compareTo(BigInteger.valueOf(0))>0){
            String[][] args = new String[2][];
            args[0] = new String[]{String.valueOf(to)};
            args[1] = new String[]{String.valueOf(amount1Out)};
            _token1.call("transfer","",args,BigInteger.ZERO);
        }

        String[][] args = new String[1][];
        args[0] = new String[]{Msg.address().toString()};
        balance0 = new BigInteger( token0.callWithReturnValue("balanceOf","",args,BigInteger.ZERO));
        balance1 = new BigInteger( token1.callWithReturnValue("balanceOf","",args,BigInteger.ZERO));

        BigInteger amount0In;
        BigInteger amount1In;

        if(balance0.compareTo(reserve.get("reserve0").subtract(amount0Out))>0){
            amount0In = balance0.subtract(reserve.get("reserve0").subtract(amount0Out));
        }else {
            amount0In = BigInteger.valueOf(0);
        }

        if(balance1.compareTo(reserve.get("reserve1").subtract(amount1Out))>0){
            amount1In = balance1.subtract(reserve.get("reserve1").subtract(amount1Out));
        }else {
            amount1In = BigInteger.valueOf(0);
        }

        require(amount0In.compareTo(BigInteger.valueOf(0))>0||amount1In.compareTo(BigInteger.valueOf(0))>0,"iSwap: INSUFFICIENT_INPUT_AMOUNT");
        _update(balance0,balance1,reserve.get("reserve0"),reserve.get("reserve1"));
        unlocked = true;
    }

    /*
        该方法是用于给开发平台团队进行分红的操作，
        若开启feeOn开关则每笔交易的手续费的6分之一流向开发团队
        但是会损坏流动性提供者的利益
    */
    private boolean _mintFee(BigInteger _reserve0,BigInteger _reserve1){

        boolean feeOn = false;

        String _feeTo = factory.callWithReturnValue("getFeeTo","",null,BigInteger.ZERO);
        //这里稍微有做下调整
        if (_feeTo.equals("0")==false){
            feeOn = true;
        }
        BigInteger _kLast = kLast;
        if (feeOn){
            if (_kLast.compareTo(BigInteger.valueOf(0))!=0){
                BigInteger rootk = sqrt(_reserve0.multiply(_reserve1));
                BigInteger rootKLast = sqrt(_kLast);
                if (rootk.compareTo(rootKLast)>0){
                    BigInteger numerator = totalSupply.multiply(rootk.subtract(rootKLast));
                    BigInteger denominator = rootk.multiply(BigInteger.valueOf(5)).add(rootKLast);
                    BigInteger liquidity = numerator.divide(denominator);
                    if (liquidity.compareTo(BigInteger.valueOf(0))>0){
                        super.mint(new Address(_feeTo),liquidity);
                    }
                }
            }
        }else if (_kLast.compareTo(BigInteger.valueOf(0))!=0){
            kLast = BigInteger.valueOf(0);
        }
        return feeOn;
    }

    public BigInteger mint(Address to){
        Locked();
        Map<String,BigInteger> reserve  = getReserves();
        String[][] args = new String[1][];
        args[0] = new String[]{Msg.address().toString()};

        BigInteger balance0 = new BigInteger( token0.callWithReturnValue("balanceOf","",args,BigInteger.ZERO));
        BigInteger balance1 = new BigInteger( token1.callWithReturnValue("balanceOf","",args,BigInteger.ZERO));

        BigInteger amount0 = balance0.subtract(new BigInteger(reserve.get("reserve0").toString()));
        BigInteger amount1 = balance1.subtract(new BigInteger(reserve.get("reserve1").toString()));
        boolean feeOn = _mintFee(reserve.get("reserve0"),reserve.get("reserve1"));
        totalSupply = super.totalSupply();
        BigInteger liquidity = new BigInteger(String.valueOf(0));
        if(totalSupply.compareTo(BigInteger.valueOf(1))==0){
            //nuls这里必须保留一个代币，按理是应该跟其他流动性代币精度一致，因为保留了一个不妥，所以进度就只设置为1
            liquidity = this.sqrt(amount0.multiply(amount1)).subtract(MINIMUM_LIQUIDIY);
//          super.addBalance(new Address("0"),new Bignteger(String.valueOf(MINIMUM_LIQUIDIY)));
        }else{
            liquidity = min(amount0.multiply(totalSupply).divide(reserve0),amount1.multiply(totalSupply).divide(reserve1));
        }
        require(liquidity.compareTo(BigInteger.valueOf(0))>0,"iSwap: INSUFFICIENT_LIQUIDITY_MINTED");
        super.mint(to,liquidity);
        _update(balance0, balance1,reserve.get("reserve0"),reserve.get("reserve1"));
        if(feeOn){
            kLast = reserve0.multiply(reserve1);
        }
        unlocked = true;
        return liquidity;
    }

    public String burn(Address to){
        Locked();
        Map<String,BigInteger> reserve = getReserves();
        Address _token0 = token0;
        Address _token1 = token1;
        String[][] args = new String[1][];
        args[0] = new String[]{Msg.address().toString()};

        BigInteger balance0 = new BigInteger( token0.callWithReturnValue("balanceOf","",args,BigInteger.ZERO));
        BigInteger balance1 = new BigInteger( token1.callWithReturnValue("balanceOf","",args,BigInteger.ZERO));
        BigInteger liquidity = balanceOf(Msg.address());
        boolean feeOn = _mintFee(reserve0,reserve1);
        BigInteger _totalSupply = totalSupply;
        BigInteger amount0 = new BigInteger(String.valueOf(liquidity.multiply(balance0).divide(_totalSupply)));
        BigInteger amount1 = new BigInteger(String.valueOf(liquidity.multiply(balance1).divide(_totalSupply)));
        require(amount0.compareTo(BigInteger.valueOf(0))>0&& amount1.compareTo(BigInteger.valueOf(0))>0,"iSwap: INSUFFICIENT_LIQUIDITY_BURNED");
        HashMap hashMap = new HashMap();
        hashMap.put("amount0",amount0.toString());
        hashMap.put("amount1",amount1.toString());

        super.burn(Msg.address(),liquidity);
        String[][] args2 = new String[2][];
        args2[0] = new String[]{String.valueOf(to)};
        args2[1] = new String[]{String.valueOf(amount0)};
        _token0.call("transfer","",args2,BigInteger.ZERO);

        String[][] args3 = new String[2][];
        args3[0] = new String[]{String.valueOf(to)};
        args3[1] = new String[]{String.valueOf(amount1)};
        _token1.call("transfer","",args3,BigInteger.ZERO);

        balance0 = new BigInteger( token0.callWithReturnValue("balanceOf","",args,BigInteger.ZERO));
        balance1 = new BigInteger( token1.callWithReturnValue("balanceOf","",args,BigInteger.ZERO));
        if (feeOn){
            kLast = reserve0.multiply(reserve1);
        }
        _update(balance0, balance1,reserve.get("reserve0"),reserve.get("reserve1"));
        unlocked = true;
        return hashMap.toString();
    }

    //未完善，下个版本继续完善该函数功能
    private void _update(BigInteger balance0,BigInteger balance1,BigInteger _reserve0,BigInteger _reserve1){
        reserve0 = balance0;
        reserve1 = balance1;
    }

    //强制同步匹配的价格
    private void sync(){
        String[][] args = new String[1][];
        args[0] = new String[]{Msg.address().toString()};
        BigInteger balance0 = new BigInteger(token0.callWithReturnValue("balanceOf","",args,BigInteger.ZERO));
        BigInteger balance1 = new BigInteger(token1.callWithReturnValue("balanceOf","",args,BigInteger.ZERO));
        _update(balance0,balance1,reserve0,reserve1);
    }

}
