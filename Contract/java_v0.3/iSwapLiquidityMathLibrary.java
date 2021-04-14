package nuls.contract;

import io.nuls.contract.sdk.Address;
import io.nuls.contract.sdk.annotation.View;
import org.checkerframework.dataflow.qual.Pure;

import java.math.BigInteger;
import java.util.HashMap;

public class iSwapLiquidityMathLibrary {

    private iSwapLibrary _iSwapLibrary;

    private HashMap computeProfitMaximizingTrade(BigInteger truePriceTokenA,BigInteger truePriceTokenB,BigInteger reserveA,BigInteger reserveB){
        HashMap hashMap = new HashMap();

        return hashMap;
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

    @Pure
    private HashMap computeLiquidityValue(BigInteger reservesA,BigInteger reservesB,BigInteger totalSupply,BigInteger liquidityAmount,boolean feeOn,BigInteger kLast){
        HashMap hashMap = new HashMap();
        if (feeOn){
            BigInteger rootk = sqrt(reservesA.multiply(reservesB));
            BigInteger rootKLast = sqrt(kLast);
            if (rootk.compareTo(rootKLast)>0){
                BigInteger numerator = totalSupply.multiply(rootk.subtract(rootKLast));
                BigInteger denominator = rootk.multiply(BigInteger.valueOf(5)).add(rootKLast);
                BigInteger _liquidity = numerator.divide(denominator);
                totalSupply = totalSupply.add(_liquidity);
              }
        }
        hashMap.put("tokenAAmount",reservesA.multiply(liquidityAmount).divide(totalSupply));
        hashMap.put("tokenBBmount",reservesB.multiply(liquidityAmount).divide(totalSupply));
        return hashMap;
    }

    @View
    public HashMap getLiquidityValue(Address factory,Address tokenA,Address tokenB,BigInteger liquidityAmount){
        String[][] args = new String[2][];
        args[0] = new String[]{tokenA.toString()};
        args[1] = new String[]{tokenB.toString()};

        String _pairAddress = factory.callWithReturnValue("getPairAddress", "", args, BigInteger.ZERO);
        Address pairAddress = new Address(_pairAddress);

        HashMap<String, BigInteger> reserves =_iSwapLibrary.getReserves(pairAddress,tokenA,tokenB);
        boolean feeOn = false;
        BigInteger kLast = new BigInteger(String.valueOf(0));
        String _feeTo = factory.callWithReturnValue("getFeeTo","",null,BigInteger.ZERO);
        //这里稍微有做下调整
        if (_feeTo.equals("0")==false){
            feeOn = true;
        }
        if (feeOn){
            String _kLast = pairAddress.callWithReturnValue("getkLast","",null,BigInteger.ZERO);
            kLast = new BigInteger(_kLast);
        }
        String _totalSupply = pairAddress.callWithReturnValue("totalSupply","",null,BigInteger.ZERO);
        BigInteger totalSupply = new BigInteger(_totalSupply);
        return computeLiquidityValue(reserves.get("reserve0"),reserves.get("reserve1"),totalSupply,liquidityAmount,feeOn,kLast);
    }

}
