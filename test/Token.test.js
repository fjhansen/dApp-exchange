import { tokens, EVM_REVERT } from './helpers'
const Token = artifacts.require('./Token')

require('chai')
.use(require('chai-as-promised'))
.should()

contract('Token', ([deployer, receiver]) => {
  const name = 'Juniper'
  const symbol = 'JUNI'
  const decimals = '18'
  const totalSupply = tokens(1000000).toString()
  let token
  beforeEach(async () => {
  token = await Token.new()
  })
  describe('deployment', () => {
    it('tracks the name in deploy', async () => {
      const result = await token.name()
      result.should.equal(name)
    })
    it('tracks the symbol', async () => {
      const result = await token.symbol()
      result.should.equal(symbol)
    })
    it('tracks the decimals', async () => {
      const result = await token.decimals()
      result.toString().should.equal(decimals)
    })

    it('tracks the total supply', async () => {
      const result = await token.totalSupply()
      result.toString().should.equal(totalSupply.toString())
    })

    it('assigns total supply to deployer', async () => {
      const result = await token.balanceOf(deployer)
      result.toString().should.equal(totalSupply.toString())
    })
    
  })

  describe('sends tokens', () => {
    
      let result
      let amount

      describe('success', async () => {
      beforeEach(async () => {
        amount = tokens(100)
        result = await token.transfer(receiver, amount, {from: deployer})
      })

    it('transfer token balances', async() => {
      let balanceOf
      balanceOf = await token.balanceOf(deployer)
      balanceOf.toString().should.equal(tokens(999900).toString())
      balanceOf = await token.balanceOf(receiver)
      balanceOf.toString().should.equal(tokens(100).toString())
    })
    it('emits a transfer event', async() => {
      // console.log("R E S U L T: ", result.logs)
      const log = result.logs[0]
      log.event.should.eq('Transfer')
      const event = log.args
      event.from.toString().should.equal(deployer, 'FROM is correct')
      event.to.should.equal(receiver, 'TO is correct')
      event.value.toString().should.equal(amount.toString(), 'VALUE is correct')
    })            
      })
      describe('failure', async () => {

      it('rejects insufficient balances', async () => {
        let invalidAmount
        invalidAmount = tokens(100000000) // 100 mil - greater than total supply
        await token.transfer(receiver, invalidAmount, { from: deployer}).should.be.rejectedWith(EVM_REVERT)

        // Attempt to transfer tokens, when there is no amount
        invalidAmount = tokens(10) // recipient does not have tokens
        await token.transfer(deployer, invalidAmount, { from: receiver}).should.be.rejectedWith(EVM_REVERT)
      })
      it('rejects invalid recipients', async () => {
        await token.transfer(0x0, amount, {from: deployer}).should.be.rejected
      })
      })      
  })

})

