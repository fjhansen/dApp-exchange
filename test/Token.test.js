const Token = artifacts.require('./Token')

require('chai')
.use(require('chai-as-promised'))
.should()

const tokens = (n) => {
  return new web3.utils.BN(
    web3.utils.toWei(n.toString(), 'ether')
  )
}

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
    it('transfer token balances', async() => {
      let balanceOf
      balanceOf = await token.balanceOf(deployer);
      console.log("deployer balance before transfer", balanceOf.toString());
      balanceOf = await token.balanceOf(receiver);
      console.log("receiver balance before transfer", balanceOf.toString())

      await token.transfer(receiver, tokens(100), {from: deployer})

      balanceOf = await token.balanceOf(deployer);
      console.log("deployer balance after transfer", balanceOf.toString());
      balanceOf = await token.balanceOf(receiver);
      console.log("receiver balance after transfer", balanceOf.toString())

    })
  })
})