const assert = require('assert')
const { updateElement, p, div } = require('../src')

module.exports = {
  export: () => assert.ok(updateElement),
  root: {
    replaceNode: () => {
      const a = p('hello world')
      const b = div('hello world')
      const expected = b.outerHTML
      const res = updateElement(a, b)
      assert.equal(res.outerHTML, expected, 'result was expected')
    },

    updateText: () => {
      const a = p('hello world')
      const b = p('hello you')
      updateElement(a, b)
      assert.equal(a.textContent, b.textContent, 'result was expected')
    },
  },

  nested: {
    replaceChild: () => {
      const a = div(p('hello world'))
      const b = div(p('hello you'))
      const expected = b.outerHTML
      updateElement(a, b)
      assert.equal(a.outerHTML, expected, 'result was expected')
    },

    replaceChildNode: () => {
      const a = div(p('hello world'))
      const b = div(div('hello world'))
      const expected = b.outerHTML
      updateElement(a, b)
      assert.equal(a.outerHTML, expected, 'result was expected')
    },

    doNothing: () => {
      const a = div(p('hello world'))
      const expected = a.outerHTML
      updateElement(a, a)
      assert.equal(a.outerHTML, expected, 'result was expected')
    },

    appendNode: () => {
      const a = div()
      const b = div(p('hello world'))
      const expected = b.outerHTML
      updateElement(a, b)
      assert.equal(a.outerHTML, expected, 'result was expected')
    },

    removeNode: () => {
      const a = div(p('hello world'))
      const b = div()
      const expected = b.outerHTML
      updateElement(a, b)
      assert.equal(a.outerHTML, expected, 'result was expected')
    },
  },
}
