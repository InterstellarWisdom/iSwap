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

    public iSwapRouter(Address _WNULS) {
        factory = new Address("tNULSeBaN62kLKJkq4MhoL89AAn4hDzT8QJw4T");
        WNULS = _WNULS;
        _iSwapLibrary = new iSwapLibrary();
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
            args2[0] = new String[]{pairAddress.toString()};
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
        require(deadline >= Block.timestamp());
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
        //???????????????nuls??????WNULS???
        WNULS.callWithReturnValue("deposit", "", null, amountMap.get("amountB"));
        //??????transfrom???????????????
        String[][] args3 = new String[2][];
        args3[0] = new String[]{pairAddress};
        args3[1] = new String[]{amountMap.get("amountB").toString()};
        WNULS.callWithReturnValue("transfer", "", args3, BigInteger.ZERO);

        Address pairAddress_ = new Address(pairAddress);
        String[][] args4 = new String[1][];
        args4[0] = new String[]{Msg.sender().toString()};
        String liquidity = pairAddress_.callWithReturnValue("mint", "", args4, BigInteger.ZERO);
        if (Msg.value().compareTo(amountMap.get("amountB")) > 0) {
            //???????????????nuls??????
            Msg.sender().transfer(Msg.value().subtract(amountMap.get("amountB")));
        }
        hashMap.put("amountA", amountMap.get("amountA"));
        hashMap.put("amountB", amountMap.get("amountB"));
        hashMap.put("liquidity", liquidity);
        return hashMap;
    }

    public HashMap addLiquidity(Address tokenA, Address tokenB, BigInteger amountADesired, BigInteger amountBDesired,
                                BigInteger amountAmin, BigInteger amountBmin, Address to, long deadline) {
        require(deadline >= Block.timestamp());
        HashMap hashMap = new HashMap();
        HashMap amountMap = new HashMap();
        amountMap = _addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAmin, amountBmin);

        String[][] args = new String[2][];
        args[0] = new String[]{tokenA.toString()};
        args[1] = new String[]{tokenB.toString()};
        String pairAddress = factory.callWithReturnValue("getPairAddress", "", args, BigInteger.ZERO);
        if (pairAddress.equals("0")) {
            //???????????????pair????????????
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
        //?????????????????????
        String liquidity = pairAddress_.callWithReturnValue("mint", "", args4, BigInteger.ZERO);
        hashMap.put("amountA", amountMap.get("amountA"));
        hashMap.put("amountB", amountMap.get("amountB"));
        hashMap.put("liquidity", liquidity);
        return hashMap;
    }

    @Payable
    public HashMap removeLiquidityNULS(Address token, BigInteger liquidity, BigInteger amountTokenMin, BigInteger amountNULSMin, Address to, long deadline) {
        require(deadline >= Block.timestamp());
        HashMap<String, BigInteger> amountMap = amountMap = removeLiquidity(token, WNULS, liquidity, amountTokenMin, amountNULSMin, Msg.address(), deadline);
        String[][] args = new String[2][];
        args[0] = new String[]{to.toString()};
        args[1] = new String[]{amountMap.get("amountA").toString()};
        token.call("transfer", "", args, BigInteger.ZERO);
        String[][] args2 = new String[1][];
        args2[0] = new String[]{amountMap.get("amountB").subtract(BigInteger.valueOf(1)).toString()};
        WNULS.callWithReturnValue("withdraw", "", args2, BigInteger.ZERO);
        to.transfer(amountMap.get("amountB").subtract(BigInteger.valueOf(2)));
        return amountMap;
    }

    public HashMap removeLiquidity(Address tokenA, Address tokenB, BigInteger liquidity, BigInteger amountAMin, BigInteger amountBMin, Address to, long deadline) {
        require(deadline >= Block.timestamp());
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
        //???????????????hashMap???????????????
        return hashMap;
    }

    //???????????????????????????A???????????????????????????B
    public HashMap<Integer, BigInteger> swapExactTokensForToken(BigInteger amountIn, BigInteger amountOutMin, String[] path, Address to, long deadline) {
        require(deadline >= Block.timestamp());
        HashMap<Integer, BigInteger> amounts = _iSwapLibrary.getAmountsOut(amountIn, path);
        require(new BigInteger(amounts.get(amounts.size() - 1).toString()).compareTo(amountOutMin) >= 0, "iSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        //????????????pair????????????????????????
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

    //?????????????????????nuls?????????????????????nrr20???
    @Payable
    public HashMap<Integer, BigInteger> swapExactNULSForTokens(BigInteger amountOutMin, String[] path, Address to, long deadline) {
        require(deadline >= Block.timestamp());
        require(path[0].equals(WNULS.toString()), "iSwapRouter: INVALID_PATH");
        HashMap<Integer, BigInteger> amounts = _iSwapLibrary.getAmountsOut(Msg.value(), path);
        require(new BigInteger(amounts.get(amounts.size() - 1).toString()).compareTo(amountOutMin) >= 0, "iSwapRouter: INSUFFICIENT_OUTPUT_AMOUNT");
        WNULS.callWithReturnValue("deposit", "", null, amounts.get(0));

        String[][] args = new String[2][];
        args[0] = new String[]{path[0]};
        args[1] = new String[]{path[1]};
        String pairAddress = factory.callWithReturnValue("getPairAddress", "", args, BigInteger.ZERO);

        amounts.get(0).subtract(BigInteger.valueOf(1));
        String[][] args2 = new String[2][];
        args2[0] = new String[]{pairAddress};
        args2[1] = new String[]{amounts.get(0).subtract(BigInteger.valueOf(1)).toString()};
        WNULS.callWithReturnValue("transfer", "", args2, BigInteger.ZERO);
        _swap(amounts, path, to);
        return amounts;
    }

    //???????????????nrc20??????????????????nuls???
    public HashMap<Integer, BigInteger> swapExactTokensForNULS(BigInteger amountIn,BigInteger amountOutMin,String [] path,Address to,long deadline){
        require(deadline >= Block.timestamp());
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
        args3[0] = new String[]{amounts.get(path.length-1).subtract(BigInteger.valueOf(1)).toString()};
        WNULS.callWithReturnValue("withdraw", "", args3, BigInteger.ZERO);
        to.transfer(amounts.get(path.length-1).subtract(BigInteger.valueOf(2)));
        return amounts;
    }

    //????????????????????????
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
//            ???????????????????????????pair??????????????????????????????swap????????????
            String[][] args3 = new String[2][];
            args3[0] = new String[]{input.toString()};
            args3[1] = new String[]{output.toString()};
            String pairAddress = factory.callWithReturnValue("getPairAddress", "", args3, BigInteger.ZERO);

            Address _pairAddress = new Address(pairAddress);
            args2[0] = new String[]{amount0Out.toString()};
            args2[1] = new String[]{amount1Out.toString()};
            args2[2] = new String[]{to.toString()};
//            ??????pair???????????????swap???????????????????????????
            _pairAddress.callWithReturnValue("swap", "", args2, BigInteger.ZERO);
        }
    }

    //?????????????????????????????????????????????
    @View
    public HashMap<Integer, BigInteger> getAmountsOut(BigInteger amountIn, String[] path) {
        return _iSwapLibrary.getAmountsOut(amountIn, path);
    }

    @View
    public BigInteger quote(BigInteger amountIn,BigInteger reserveIn,BigInteger reserveOut){
        return _iSwapLibrary.quote(amountIn,reserveIn,reserveOut);
    }

}