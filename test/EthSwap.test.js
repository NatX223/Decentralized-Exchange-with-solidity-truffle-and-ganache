//const { default: web3 } = require('web3')

//importing the token and ethswap contracts for tests
const Token = artifacts.require('Token')
const EthSwap = artifacts.require('EthSwap')

//importing chai assertion
require('chai')
.use(require('chai-as-promised'))
.should

//converting ether to wei for future transactions
function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}
//setting a test suite for the ethswap contarct
contract('EthSwap', async accounts => {
    let token, ethSwap
    before(async () => {
        token = await Token.new()
        ethSwap = await EthSwap.new() //token.address

        //transfer tokens from address to ethswap smartcontract
        await token.transfer(ethSwap.address, tokens('1000000'))
    })


    //testing the accounts 
    describe('account check', async () => {
        it('accounts are real', async() => {
            const balance = await token.balanceOf.call(accounts[1]);
            assert.equal(balance.toString(), '0')
        })
    })


    //testing the token name
    describe('Token deployment', async () => {
        it('contract has a name', async() => {
            const name = await token.name()
            assert.equal(name, 'DApp Token')
        })
    })

    //testing the ethswap name
    describe('EthSwap deployment', async () => {
        it('contract has a name', async() => {
            const name = await ethSwap.name()
            assert.equal(name, 'eth Swap')
        })

        //confirming that the contract has tokens to dispence
        it('contract has tokens', async () => {
            let balance = await token.balanceOf.call(ethSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('buyTokens()', async () => {
        let result

        before(async () => {
            //purchase of token
            result = await ethSwap.buyTokens({ from: accounts[1], value: web3.utils.toWei('1', 'ether')})
        })

        it('it allows for instant sale of tokens', async () => {
            let investorBalance
            investorBalance = await token.balanceOf.call(accounts[1])
            assert.equal(investorBalance.toString(), tokens('100')) 

            //ckeck ethSwap balance after purchase
            let ethSwapBalance 
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('999900'))
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'ether'))

            
            //check logs to ,ake sure that the event emitted the correct values
            const event = result.logs[0].args
            assert.equal(event.account, accounts[1])
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')
        })
    })
    

     describe('sellTokens()', async () => {
        let result

        before(async () => {
            //sale of token
            //approval of sale
            await token.approve(ethSwap.address, tokens('100'), { from: accounts[1] })
            //actual transfer
            result = await ethSwap.sellTokens(tokens('100'), { from: accounts[1] })
        })

        it('it allows for instant sale of tokens', async () => {
            //check investor token balance after sale
            let investorBalance = await token.balanceOf.call(accounts[1])
            assert.equal(investorBalance.toString(), tokens('0')) 

            //ckeck ethSwap balance after purchase
            let ethSwapBalance 
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('1000000'))
            ethSwapBalance = await web3.eth.getBalance(ethSwap.balance)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0', 'ether'))

            //check logs to ,ake sure that the event emitted the correct values 
            const event = result.logs[0].args
            assert.equal(event.account, accounts[1])
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')

            //Failure test
            await ethSwap.sellTokens(tokens('500'), { from: accounts[1] }).should.be.rejected;
        })
    })
})






