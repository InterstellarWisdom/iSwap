package nuls.contract;

import io.nuls.contract.sdk.Address;
import io.nuls.contract.sdk.Block;
import io.nuls.contract.sdk.Contract;
import io.nuls.contract.sdk.Msg;
import io.nuls.contract.sdk.annotation.Payable;
import io.nuls.contract.sdk.annotation.View;

import java.math.BigInteger;
import java.util.HashMap;

import static io.nuls.contract.sdk.Utils.require;

public class iSwapRouter implements Contract {

    public Address factory;

    public Address WNULS;

    private iSwapLibrary _iSwapLibrary;


    public iSwapRouter(Address _WNULS,Address _factory) {
        factory = _factory;
        WNULS = _WNULS;
        _iSwapLibrary = new iSwapLibrary(_factory);
    }

    private HashMap<String, BigInteger> _addLiquidity(Address tokenA, Address tokenB, BigInteger amountADesired, BigInteger amountBDesired,
                                                      BigInteger amountAmin, BigInteger amountBmin) {
        HashMap hashMap = new HashMap();
        String[][] args = new String[2][];
        args[0] = new String[]{tokenA.toString()};
        args[1] = new String[]{tokenB.toString()};

        String pairAddress = factory.callWithReturnValue("getPairAddress", "", args, BigInteger.ZERO);
        if (pairAddress.equals("0")) {
            String[][] args2 = new String[3][];
            args2[0] = new String[]{pairAddress};
            args2[1] = new String[]{tokenB.toString()};
            args2[2] = new String[]{tokenA.toString()};
            factory.callWithReturnValue("createPair", "", args2, BigInteger.ZERO);
        }

        HashMap<String, BigInteger> reserves = _iSwapLibrary.getReserves(new Address(pairAddress), tokenA, tokenB);
        BigInteger amountA, amountB;
        if (reserves.get("reserve0").compareTo(BigInteger.valueOf(0)) == 0 && reserves.get("reserve1").compareTo(BigInteger.valueOf(0)) == 0) {
            amountA = amountADesired;
            amountB = amountBDesired;
        } else {
            BigInteger amountBOptimal = _iSwapLibrary.quote(amountADesired, reserves.get("reserve0"), reserves.get("reserve1"));
            if (amountBOptimal.compareTo(amountBDesired) <= 0) {
                require(amountBOptimal.compareTo(amountBmin) >= 0, "iSwapRouter: INSUFFICIENT_B_AMOUNT");
                amountA = amountADesired;
                amountB = amountBOptimal;
            } else {
                BigInteger amountAOptimal = _iSwapLibrary.quote(amountBDesired, reserves.get("reserve0"), reserves.get("reserve1"));
                require(amountAOptimal.compareTo(amountADesired)<=0,"need amountAOptimal less than amountADesired");
                require(amountAOptimal.compareTo(amountAmin) >= 0, "iSwapRouter: INSUFFICIENT_A_AMOUNT");
                amountA = amountAOptimal;
                amountB = amountBDesired;
            }
        }
        hashMap.put("amountA", amountA);
        hashMap.put("amountB", amountB);
        return hashMap;
    }

    @Payable
    public void _payable() {

    }

    @Payable
    public HashMap addLiquidityNUlS(Address token, BigInteger amountTokenDesired, BigInteger amountTokenMin, BigInteger amountNulsMin, Address to, long deadline) {
        require(deadline >= Block.timestamp(),"iSwap: EXPIRED");
        HashMap hashMap = new HashMap();
        HashMap<String, BigInteger> amountMap = _addLiquidity(token, WNULS, amountTokenDesired, Msg.value(), amountTokenMin, amountNulsMin);
        String[][] args = new String[2][];
        args[0] = new String[]{token.toString()};
        args[1] = new String[]{WNULS.toString()};
        String pairAddress = factory.callWithReturnValue("getPairAddress", "", args, BigInteger.ZERO);

        String[][] args2 = new String[3][];
        args2[0] = new String[]{Msg.sender().toString()};
        args2[1] = new String[]{pairAddress};
        args2[2] = new String[]{amountMap.get("amountA").toString()};
        token.call("transferFrom", "", args2, BigInteger.ZERO);
        //存入等额的nuls量到WNULS中
        WNULS.callWithReturnValue("deposit", "", null, amountMap.get("amountB"));
        //调用transfrom（有改动）
        String[][] args3 = new String[2][];
        args3[0] = new String[]{pairAddress};
        args3[1] = new String[]{amountMap.get("amountB").toString()};
        WNULS.callWithReturnValue("transfer", "", args3, BigInteger.ZERO);

        Address pairAddress_ = new Address(pairAddress);
        String[][] args4 = new String[1][];
        args4[0] = new String[]{Msg.sender().toString()};
        String liquidity = pairAddress_.callWithReturnValue("mint", "", args4, BigInteger.ZERO);
        if (Msg.value().compareTo(amountMap.get("amountB")) > 0) {
            //反还多余的nuls代币
            Msg.sender().transfer(Msg.value().subtract(amountMap.get("amountB")));
        }
        hashMap.put("amountA", amountMap.get("amountA"));
        hashMap.put("amountB", amountMap.get("amountB"));
        hashMap.put("liquidity", liquidity);
        return hashMap;
    }

    public HashMap addLiquidity(Address tokenA, Address tokenB, BigInteger amountADesired, BigInteger amountBDesired,
                                BigInteger amountAmin, BigInteger amountBmin, Address to, long deadline) {
        require(deadline >= Block.timestamp(),"iSwap: EXPIRED");
        HashMap hashMap = new HashMap();
        HashMap amountMap = new HashMap();
        amountMap = _addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAmin, amountBmin);

        String[][] args = new String[2][];
        args[0] = new String[]{tokenA.toString()};
        args[1] = new String[]{tokenB.toString()};
        String pairAddress = factory.callWithReturnValue("getPairAddress", "", args, BigInteger.ZERO);
        if (pairAddress.equals("0")) {
            //分配个新的pair合约地址
        }
        String[][] args2 = new String[3][];
        args2[0] = new String[]{Msg.sender().toString()};
        args2[1] = new String[]{pairAddress};
        args2[2] = new String[]{amountMap.get("amountA").toString()};

        String[][] args3 = new String[3][];
        args3[0] = new String[]{Msg.sender().toString()};
        args3[1] = new String[]{pairAddress};
        args3[2] = new String[]{amountMap.get("amountB").toString()};

        tokenA.call("transferFrom", "", args2, BigInteger.ZERO);
        tokenB.call("transferFrom", "", args3, BigInteger.ZERO);

        Address pairAddress_ = new Address(pairAddress);
        String[][] args4 = new String[1][];
        args4[0] = new String[]{to.toString()};
        //开始铸造流动性
        String liquidity = pairAddress_.callWithReturnValue("mint", "", args4, BigInteger.ZERO);
        hashMap.put("amountA", amountMap.get("amountA"));
        hashMap.put("amountB", amountMap.get("amountB"));
        hashMap.put("liquidity", liquidity);
        return hashMap;
    }

    @Payable
    public HashMap removeLiquidityNULS(Address token, BigInteger liquidity, BigInteger amountTokenMin, BigInteger amountNULSMin, Address to, long deadline) {
        require(deadline >= Block.timestamp(),"iSwap: EXPIRED");
        HashMap<String, BigInteger> amountMap = removeLiquidity(token, WNULS, liquidity, amountTokenMin, amountNULSMin, Msg.address(), deadline);
        String[][] args = new String[2][];
        args[0] = new String[]{to.toString()};
        args[1] = new String[]{amountMap.get("amountA").toString()};
        token.call("transfer", "", args, BigInteger.ZERO);
        String[][] args2 = new String[1][];
        args2[0] = new String[]{amountMap.get("amountB").toString()};
        WNULS.callWithReturnValue("withdraw", "", args2, BigInteger.ZERO);
        to.transfer(amountMap.get("amountB"));
        return amountMap;
    }

    public HashMap removeLiquidity(Address tokenA, Address tokenB, BigInteger liquidity, BigInteger amountAMin, BigInteger amountBMin, Address to, long deadline) {
        require(deadline >= Block.timestamp(),"iSwap: EXPIRED");
        HashMap hashMap = new HashMap();
        String[][] args = new String[2][];
        args[0] = new String[]{tokenA.toString()};
        args[1] = new String[]{tokenB.toString()};
        String pairAddress = factory.callWithReturnValue("getPairAddress", "", args, BigInteger.ZERO);

        String[][] args2 = new String[3][];
        args2[0] = new String[]{Msg.sender().toString()};
        args2[1] = new String[]{pairAddress};
        args2[2] = new String[]{liquidity.toString()};
        Address _pairAddress = new Address(pairAddress);
        _pairAddress.callWithReturnValue("transferFrom", "", args2, BigInteger.ZERO);

        String[][] args3 = new String[1][];
        args3[0] = new String[]{to.toString()};
        String amountStr = _pairAddress.callWithReturnValue("burn", "", args3, BigInteger.ZERO);

        String[] amountArray = amountStr.substring(1, amountStr.length() - 1).split(",");
        String amountKey1 = amountArray[0].substring(0, amountArray[0].indexOf("="));
        String amountValue1 = amountArray[0].substring(amountKey1.length() + 1, amountArray[0].length());
        String amountKey0 = amountArray[1].substring(0, amountArray[1].indexOf("="));
        String amountValue0 = amountArray[1].substring(amountKey0.length() + 1, amountArray[1].length());
        BigInteger _amountValue0 = new BigInteger(amountValue0);
        BigInteger _amountValue1 = new BigInteger(amountValue1);

        BigInteger amountA, amountB;
        Address token0;
        if (tokenA.toString().compareTo(tokenB.toString()) < 0) {
            token0 = tokenA;
        } else {
            token0 = tokenB;
        }
        if (token0.toString().equals(tokenA.toString())) {
            amountA = _amountValue0;
            amountB = _amountValue1;
        } else {
            amountA = _amountValue1;
            amountB = _amountValue0;
        }
        require(amountA.compareTo(amountAMin) >= 0, "iSwapRouter: INSUFFICIENT_A_AMOUNT");
        require(amountB.compareTo(amountBMin) >= 0, "iSwapRouter: INSUFFICIENT_B_AMOUNT");
        hashMap.put("amountA", amountA);
        hashMap.put("amountB", amountB);
        //处理得到到hashMap字符串集合
        return hashMap;
    }

    //给出精确数额的代币A看下能换出多少代币B
    public HashMap<Integer, BigInteger> swapExactTokensForToken(BigInteger amountIn, BigInteger amountOutMin, String[] path, Address to, long deadline) {
        require(deadline >= Block.timestamp(),"iSwap: EXPIRED");
        HashMap<Integer, BigInteger> amounts = _iSwapLibrary.getAmountsOut(amountIn, path);
        require(new BigInteger(amounts.get(amounts.size() - 1).toString()).compareTo(amountOutMin) >= 0, "iSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        //向第一对pair合约地址进行转账
        String[][] args = new String[2][];
        args[0] = new String[]{path[0]};
        args[1] = new String[]{path[1]};
        String pairAddress = factory.callWithReturnValue("getPairAddress", "", args, BigInteger.ZERO);
        String[][] args2 = new String[3][];
        args2[0] = new String[]{Msg.sender().toString()};
        args2[1] = new String[]{pairAddress};
        args2[2] = new String[]{String.valueOf(amounts.get(0))};
        new Address(path[0]).callWithReturnValue("transferFrom", "", args2, BigInteger.ZERO);
        _swap(amounts, path, to);
        return amounts;
    }

    public HashMap swapTokensForExactTokens(BigInteger amountOut,BigInteger amountInMax,String [] path,Address to,long deadline){
        require(deadline >= Block.timestamp(),"iSwap: EXPIRED");
        HashMap<Integer, BigInteger> amounts = _iSwapLibrary.getAmountsIn(amountOut,path);
        require(new BigInteger(amounts.get(0).toString()).compareTo(amountInMax) <= 0,"EXCESSIVE_INPUT_AMOUNT");
        String[][] args = new String[2][];
        args[0] = new String[]{path[0]};
        args[1] = new String[]{path[1]};
        String pairAddress = factory.callWithReturnValue("getPairAddress", "", args, BigInteger.ZERO);
        String[][] args2 = new String[3][];
        args2[0] = new String[]{Msg.sender().toString()};
        args2[1] = new String[]{pairAddress};
        args2[2] = new String[]{String.valueOf(amounts.get(0))};
        new Address(path[0]).callWithReturnValue("transferFrom", "", args2, BigInteger.ZERO);
        _swap(amounts, path, to);
        return amounts;
    }

    public HashMap swapTokensForExactNULS(BigInteger amountOut,BigInteger amountInMax,String[] path,Address to,long deadline){
        require(deadline >= Block.timestamp(),"iSwap: EXPIRED");
        require(path[path.length-1].equals(WNULS.toString()),"iSwapRouter:INVALID_PATH");
        HashMap<Integer, BigInteger> amounts = _iSwapLibrary.getAmountsIn(amountOut,path);
        require(new BigInteger(amounts.get(0).toString()).compareTo(amountInMax) <= 0,"EXCESSIVE_INPUT_AMOUNT");
        String[][] args = new String[2][];
        args[0] = new String[]{path[0]};
        args[1] = new String[]{path[1]};
        String pairAddress = factory.callWithReturnValue("getPairAddress", "", args, BigInteger.ZERO);
        String[][] args2 = new String[3][];
        args2[0] = new String[]{Msg.sender().toString()};
        args2[1] = new String[]{pairAddress};
        args2[2] = new String[]{String.valueOf(amounts.get(0))};
        new Address(path[0]).callWithReturnValue("transferFrom", "", args2, BigInteger.ZERO);
        _swap(amounts,path,Msg.address());
        String[][] args3 = new String[1][];
        args3[0] = new String[]{amounts.get(amounts.size() - 1).toString()};
        WNULS.callWithReturnValue("withdraw", "", args3, BigInteger.ZERO);
        to.transfer(amounts.get(amounts.size() - 1));
        return amounts;
    }

    //给出精确数额的nuls币，能换出多少nrc20币
    @Payable
    public HashMap<Integer, BigInteger> swapExactNULSForTokens(BigInteger amountOutMin, String[] path, Address to, long deadline) {
        require(deadline >= Block.timestamp(),"iSwap: EXPIRED");
        require(path[0].equals(WNULS.toString()), "iSwapRouter: INVALID_PATH");
        HashMap<Integer, BigInteger> amounts = _iSwapLibrary.getAmountsOut(Msg.value(), path);
        require(new BigInteger(amounts.get(amounts.size() - 1).toString()).compareTo(amountOutMin) >= 0, "iSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        WNULS.callWithReturnValue("deposit", "", null, amounts.get(0));

        String[][] args = new String[2][];
        args[0] = new String[]{path[0]};
        args[1] = new String[]{path[1]};
        String pairAddress = factory.callWithReturnValue("getPairAddress", "", args, BigInteger.ZERO);

        String[][] args2 = new String[2][];
        args2[0] = new String[]{pairAddress};
        args2[1] = new String[]{amounts.get(0).toString()};
        WNULS.callWithReturnValue("transfer", "", args2, BigInteger.ZERO);
        _swap(amounts, path, to);
        return amounts;
    }

    //给出精确的nrc20币能换出多少nuls币
    public HashMap<Integer, BigInteger> swapExactTokensForNULS(BigInteger amountIn,BigInteger amountOutMin,String [] path,Address to,long deadline){
        require(deadline >= Block.timestamp(),"iSwap: EXPIRED");
        require(path[path.length-1].equals(WNULS.toString()),"iSwapRouter:INVALID_PATH");
        HashMap<Integer, BigInteger> amounts = _iSwapLibrary.getAmountsOut(amountIn,path);
        require(new BigInteger(amounts.get(amounts.size() - 1).toString()).compareTo(amountOutMin) >= 0, "iSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        String[][] args = new String[2][];
        args[0] = new String[]{path[0]};
        args[1] = new String[]{path[1]};
        String pairAddress = factory.callWithReturnValue("getPairAddress", "", args, BigInteger.ZERO);
        String[][] args2 = new String[3][];
        args2[0] = new String[]{Msg.sender().toString()};
        args2[1] = new String[]{pairAddress};
        args2[2] = new String[]{String.valueOf(amounts.get(0))};
        new Address(path[0]).callWithReturnValue("transferFrom", "", args2, BigInteger.ZERO);
        _swap(amounts,path,Msg.address());

        String[][] args3 = new String[1][];
        args3[0] = new String[]{amounts.get(path.length-1).toString()};
        WNULS.callWithReturnValue("withdraw", "", args3, BigInteger.ZERO);
        to.transfer(amounts.get(path.length-1));
        return amounts;
    }

    //给定精确的Token需要多少nuls才能换取
    @Payable
    public HashMap<Integer, BigInteger> swapNULSForExactTokens(BigInteger amountOut,String[] path,Address to,long deadline){
        require(deadline >= Block.timestamp(),"iSwap: EXPIRED");
        require(path[0].equals(WNULS.toString()),"iSwap:INVALID_PATH");
        HashMap<Integer, BigInteger> amounts = _iSwapLibrary.getAmountsIn(amountOut,path);
        require(amounts.get(0).compareTo(Msg.value())<=0,"iSwap: EXCESSIVE_INPUT_AMOUNT");
        WNULS.callWithReturnValue("deposit", "", null,amounts.get(0));
        String[][] args = new String[2][];
        args[0] = new String[]{path[0]};
        args[1] = new String[]{path[1]};
        String pairAddress = factory.callWithReturnValue("getPairAddress", "", args, BigInteger.ZERO);

        String[][] args2 = new String[2][];
        args2[0] = new String[]{pairAddress};
        args2[1] = new String[]{amounts.get(0).toString()};
        WNULS.callWithReturnValue("transfer", "", args2, BigInteger.ZERO);
        _swap(amounts,path,to);
        if (Msg.value().compareTo(amounts.get(0)) > 0) {
            //反还多余的nuls代币
            Msg.sender().transfer(Msg.value().subtract(amounts.get(0)));
        }
        return amounts;
    }

    //内部调用交换函数
    private void _swap(HashMap<Integer, BigInteger> amounts, String[] path, Address _to) {
        for (int i = 0; i < path.length - 1; i++) {
            Address input = new Address(path[i]);
            Address output = new Address(path[i + 1]);
            Address token0;
            if (input.toString().compareTo(output.toString()) < 0) {
                token0 = input;
            } else {
                token0 = output;
            }
            BigInteger amountOut = amounts.get(i + 1);
            BigInteger amount0Out, amount1Out;
            if (input.toString().equals(token0.toString())) {
                amount0Out = BigInteger.valueOf(0);
                amount1Out = amountOut;
            } else {
                amount0Out = amountOut;
                amount1Out = BigInteger.valueOf(0);
            }
            String[][] args = new String[2][];
            String[][] args2 = new String[3][];
            Address to;
            if (i < path.length - 2) {
                args[0] = new String[]{output.toString()};
                args[1] = new String[]{path[i + 2]};
                String pairAddress = factory.callWithReturnValue("getPairAddress", "", args, BigInteger.ZERO);
                to = new Address(pairAddress);
            } else {
                to = _to;
            }
//            从工厂合约里面取得pair合约地址，然后再调用swap交换方法
            String[][] args3 = new String[2][];
            args3[0] = new String[]{input.toString()};
            args3[1] = new String[]{output.toString()};
            String pairAddress = factory.callWithReturnValue("getPairAddress", "", args3, BigInteger.ZERO);

            Address _pairAddress = new Address(pairAddress);
            args2[0] = new String[]{amount0Out.toString()};
            args2[1] = new String[]{amount1Out.toString()};
            args2[2] = new String[]{to.toString()};
//            调用pair合约里面的swap方法进行代币的交换
            _pairAddress.callWithReturnValue("swap", "", args2, BigInteger.ZERO);
        }
    }

    //预计算：指定资产tokenA的数量，计算可以换出多少tokenB
    @View
    public HashMap<Integer, BigInteger> getAmountsOut(BigInteger amountIn, String[] path) {
        return _iSwapLibrary.getAmountsOut(amountIn, path);
    }

    //getAmountsOut的资产函数
    @View
    public BigInteger getAmountOut(BigInteger amountIn,BigInteger reserveIn,BigInteger reserveOut){

        return _iSwapLibrary.getAmountOut(amountIn,reserveIn,reserveOut);
    }

    //指定tokenB数量的资产，计算需要多少tokenA的资产
    @View
    public HashMap<Integer, BigInteger> getAmountsIn(BigInteger amountOut,String[] path){

        return _iSwapLibrary.getAmountsIn(amountOut,path);
    }

    //getAmountsIn的资产函数
    @View
    public BigInteger getAmountIn(BigInteger amountOut,BigInteger reserveIn,BigInteger reserveOut){

        return _iSwapLibrary.getAmountIn(amountOut,reserveIn,reserveOut);
    }

    @View
    public BigInteger quote(BigInteger amountIn,BigInteger reserveIn,BigInteger reserveOut){
        return _iSwapLibrary.quote(amountIn,reserveIn,reserveOut);
    }


}