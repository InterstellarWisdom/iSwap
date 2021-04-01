package nuls.contract;

import io.nuls.contract.sdk.Address;

public class TokenPojo {
    Address token0;
    Address token1;
    public Address getToken0() {
        return token0;
    }

    public void setToken0(Address token0) {
        this.token0 = token0;
    }

    public Address getToken1() {
        return token1;
    }

    public void setToken1(Address token1) {
        this.token1 = token1;
    }

}
