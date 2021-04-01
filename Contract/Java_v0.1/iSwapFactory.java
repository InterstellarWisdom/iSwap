package nuls.contract;

import io.nuls.contract.sdk.Address;
import io.nuls.contract.sdk.Contract;
import io.nuls.contract.sdk.Msg;
import io.nuls.contract.sdk.annotation.View;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import static io.nuls.contract.sdk.Utils.require;

//工厂合约主要用于调用pair合约，创建交易对
public class iSwapFactory implements Contract{
    public Address feeTo;
    public Address feeToSetter;
    public Map<TokenPojo, Address> getPair = new HashMap<TokenPojo,Address>();
    public ArrayList<Address> allPairs = new ArrayList<Address>();

    public iSwapFactory(Address _feeToSetter){
        feeToSetter =  _feeToSetter;
    }

    @View
    public Address getPairAddress(Address tokenA,Address tokenB){
        Address token0;
        Address token1;
        if(tokenA.toString().compareTo(tokenB.toString())<0){
            token0 = tokenA;
            token1 = tokenB;
        }else {
            token0 = tokenB;
            token1 = tokenA;
        }
        for (TokenPojo tokenPojo : getPair.keySet()){
            if(tokenPojo.getToken0().equals(token0)&&tokenPojo.getToken1().equals(token1)){
                return getPair.get(tokenPojo);
            }
        }
        return  new Address("0");
    }

    //返回pair地址长度
    @View
    public int allPairsLength() {
        return allPairs.toArray().length;
    }

    //创建交易对时候查看交易对是否已经存在
    private boolean checkRepeat(Address tokenA,Address tokenB){
        Address token0;
        Address token1;
        if(tokenA.toString().compareTo(tokenB.toString())<0){
            token0 = tokenA;
            token1 = tokenB;
        }else {
            token0 = tokenB;
            token1 = tokenA;
        }
        for (TokenPojo tokenPojo : getPair.keySet()){
            if(tokenPojo.getToken0().equals(token0)&&tokenPojo.getToken1().equals(token1)){
                return false;
            }
        }
        return true;
    }

    public Address createPair(Address pairAddress,Address tokenA,Address tokenB){
        require(tokenA.toString().equals(tokenB.toString())==false,"iSwap: IDENTICAL_ADDRESSES");
        //对Address进行排序，保证存入交易对的先后顺序
        require(checkRepeat(tokenA,tokenB),"The pair already exists");
        Address token0 = tokenA;
        Address token1 = tokenB;
        if(tokenA.toString().compareTo(tokenB.toString())<0){
            token0 = tokenA;
            token1 = tokenB;
        }else {
            token0 = tokenB;
            token1 = tokenA;
        }
        String[][] args = new String[2][];
        args[0] = new String[]{token0.toString()};
        args[1] = new String[]{token1.toString()};
        pairAddress.call("initialize","",args,BigInteger.ZERO);
        TokenPojo tokenPojo = new TokenPojo();
        tokenPojo.setToken0(token0);
        tokenPojo.setToken1(token1);
        getPair.put(tokenPojo,pairAddress);
        allPairs.add(pairAddress);
        return pairAddress;
    }

    public void setFeeTo(Address _feeTo){
        require(Msg.sender().toString().equals(feeToSetter.toString()),"FORBIDDEN");
        feeTo = _feeTo;
    }

    public void setFeeToSetter(Address _feeToSetter){
        require(Msg.sender().toString().equals(feeToSetter.toString()),"FORBIDDEN");
        feeToSetter = _feeToSetter;
    }

    @View
    public Address getFeeTo(){
        return feeTo;
    }

}
