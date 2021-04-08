package nuls.contract;

import io.nuls.contract.sdk.Address;
import io.nuls.contract.sdk.Contract;
import io.nuls.contract.sdk.annotation.Payable;
import io.nuls.contract.sdk.annotation.View;
import org.checkerframework.dataflow.qual.Pure;

import java.math.BigInteger;
import java.util.HashMap;

import static io.nuls.contract.sdk.Utils.require;

public class iSwapLibrary {

    private Address factory = new Address("tNULSeBaN62kLKJkq4MhoL89AAn4hDzT8QJw4T");

    private HashMap<Integer,BigInteger> amountMap;

    public void iSwapLibrary() {

    }

    @View
    public HashMap getReserves(Address pairAddress,Address tokenA, Address tokenB){
        //对地址进行排序
        Address token0;
        if(tokenA.toString().compareTo(tokenB.toString())<0){
            token0 = tokenA;

        }else {
            token0 = tokenB;
        }

        HashMap reserveMap = new HashMap();
        String reservesStr = pairAddress.callWithReturnValue("getReserves","",null,BigInteger.ZERO);
        String[] reserveArray  = reservesStr.substring(1,reservesStr.length()-1).split(",");

        String reserveKey0=reserveArray[1].substring(0, reserveArray[1].indexOf("="));
        String reserveValue0=reserveArray[1].substring(reserveKey0.length()+1, reserveArray[1].length());
        String reserveKey1=reserveArray[0].substring(0, reserveArray[0].indexOf("="));
        String reserveValue1=reserveArray[0].substring(reserveKey1.length()+1, reserveArray[0].length());

        BigInteger reserve0 = BigInteger.valueOf(0);
        BigInteger reserve1 = BigInteger.valueOf(0);
        if (reserveValue0.equals("0")){
           reserveMap.put("reserve0", reserve0);
           reserveMap.put("reserve1", reserve1);
        }

        if(tokenA.toString().equals(token0.toString())){
            reserve0 =  new BigInteger(reserveValue0);
            reserve1 = new BigInteger(reserveValue1);
        }else {
            reserve0 =  new BigInteger(reserveValue1);
            reserve1 = new BigInteger(reserveValue0);
        }

        reserveMap.put("reserve0", reserve0);
        reserveMap.put("reserve1", reserve1);
        return reserveMap;
    }

    @View
    public BigInteger quote(BigInteger amountA,BigInteger reserveA,BigInteger reserveB){
        require(amountA.compareTo(BigInteger.valueOf(0))>0,"iSwapLibrary: INSUFFICIENT_AMOUNT");
        require(reserveA.compareTo(BigInteger.valueOf(0))>0&&reserveB.compareTo(BigInteger.valueOf(0))>0,"iSwapLibrary: INSUFFICIENT_LIQUIDITY");
        BigInteger amountB = amountA.multiply(reserveB).divide(reserveA);
        return amountB;
    }

    @View
    //得到兑换路径中应该换取的代币数量
    public HashMap<Integer,BigInteger> getAmountsOut(BigInteger amountIn, String[] path){
        require(path.length>=2,"iSwapLibrary: INVALID_PATH");
        BigInteger[] amounts = new BigInteger[path.length];
        amounts[0] = amountIn;
        HashMap<String,BigInteger> reserveMap = new HashMap<String, BigInteger>();
        String[][] args = new String[2][];
        amountMap = new HashMap<Integer, BigInteger>();
        amountMap.put(0,amountIn);
        for (int i=0;i<path.length-1;i++){
            //调用工厂合约得到tokenA和tokenB对应的pair地址
            args[0] = new String[]{path[i]};
            args[1] = new String[]{path[i+1]};
            String pairAddress = factory.callWithReturnValue("getPairAddress","",args,BigInteger.ZERO);
            reserveMap  = getReserves(new Address(pairAddress),new Address(path[i]),new Address(path[i+1]));
            amounts[i+1] = getAmountOut(amounts[i],reserveMap.get("reserve0"),reserveMap.get("reserve1"));
            amountMap.put(i+1,amounts[i+1]);
        }
        return amountMap;
    }

    @View
    public BigInteger getAmountOut(BigInteger amountIn,BigInteger reserveIn,BigInteger rerserveOut){
        require(amountIn.compareTo(BigInteger.valueOf(0))>0,"iSwapLibrary: INSUFFICIENT_INPUT_AMOUNT");
        require(reserveIn.compareTo(BigInteger.valueOf(0))>0&&rerserveOut.compareTo(BigInteger.valueOf(0))>0,"iSwapLibrary: INSUFFICIENT_LIQUIDITY");
        BigInteger amountInWihFee = amountIn.multiply(BigInteger.valueOf(997));
        BigInteger numerator = amountInWihFee.multiply(rerserveOut);
        BigInteger denominator = reserveIn.multiply(BigInteger.valueOf(1000)).add(amountInWihFee);
        BigInteger amountOut = numerator.divide(denominator);
        return  amountOut;
    }
}
