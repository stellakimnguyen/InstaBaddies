/* test/User.js */

var expect = require('chai').expect;

const sum = (a, b) => {
  if (!a) a = 0;
  if (!b) b = 0;
  console.log(typeof a)
  console.log(typeof b)
  let typeof1 = typeof a;
  let typeof2 = typeof b;
  if (!typeof1 === 'number' || !typeof2 === 'number') {
    throw new TypeError()
  }
  return a + b || 0;
}

describe('#sum()', function () {

  context('without arguments', function () {
    it('should return 0', function () {
      expect(sum()).to.equal(0)
    })
  })

  context('with number arguments', function () {
    it('should return sum of arguments', function () {
      expect(sum(1, 5)).to.equal(6)
    })

    it('should return argument when only one argument is passed', function () {
      expect(sum(5)).to.equal(5)
    })
  })

  context('with non-number arguments', function () {
    it('should throw error', function () {
      expect(function () {
        sum(1, 'a')
      }).to.throw(TypeError, 'sum() expects only numbers.')
    })
  })

})