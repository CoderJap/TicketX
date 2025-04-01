const {expect} = require("chai")

describe("TokenMatser" , () =>{
  describe("Deployment",()=>{
    it("Sets the name",async()=>{
      const TokenMatser = await ethers.getContractFactory("TokenMaster")
      let tokenMaster = await TokenMatser.deploy("TokenMaster","TM")
      let name = await tokenMaster.name()
      expect(name).to.equal("TokenMaster")
    })
  })
})