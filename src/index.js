/* globals define */
(function (root, factory) {
  'use strict'
  if (typeof define === 'function' && define.amd) {
    define([], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory()
  } else {
    root.adom = factory()
  }
}(this, function () {
  'use strict'

  const ELEMENT_NODE = 1
  const TEXT_NODE = 3

  function toType (val) {
    const str = ({}).toString.call(val)
    return str.toLowerCase().slice(8, -1)
  }

  function appendChild (parent, child) {
    const type = toType(child)
    if (type === 'array') {
      child.reduce(appendChild, parent)
    } else if (child instanceof window.Element) {
      parent.appendChild(child)
    } else if (type === 'string') {
      parent.appendChild(document.createTextNode(child))
    }
    return parent
  }

  function setStyles (el, styles) {
    if (!styles) {
      el.removeAttribute('styles')
    } else {
      for (let prop in styles) {
        if (prop in el.style) {
          el.style[prop] = styles[prop]
        } else {
          console.warn(`${prop} is not a valid style for a <${el.tagName.toLowerCase()}>`)
        }
      }
    }
    return el
  }

  function getAttributes (el) {
    const attrs = {}
    const len = el.attributes.length
    for (let x = 0; x < len; x++) {
      attrs[el.attributes[x].name] = el.attributes[x].value
    }
    return attrs
  }

  function setAttributes (el, attrs) {
    for (let prop in attrs) {
      if (attrs[prop] == null) {
        el.removeAttribute(prop)
        prop === 'value' && (el.value = '')
      } else {
        el.setAttribute(prop, attrs[prop])
        prop === 'value' && (el.value = attrs[prop])
      }
    }
    return el
  }

  function updateAttributes (target, source) {
    const attrs = getAttributes(source)

    // mark target attrs not in source for removal
    const len = target.attributes.length
    for (let x = 0; x < len; x++) {
      if (!attrs.hasOwnProperty(target.attributes[x].name)) {
        attrs[target.attributes[x].name] = undefined
      }
    }

    return setAttributes(target, attrs)
  }

  function createElement (tagName, textOrPropsOrChild, ...otherChildren) {
    const el = document.createElement(tagName)

    if (toType(textOrPropsOrChild) === 'object') {
      setAttributes(el, textOrPropsOrChild)
    } else {
      appendChild(el, textOrPropsOrChild)
    }

    otherChildren && appendChild(el, otherChildren)

    return el
  }

  function updateElement (target, source) {
    // replace if different tags
    if (target.nodeName !== source.nodeName) {
      target = source.cloneNode(false)
    }

    // update attributes or text content
    if (target.nodeType === ELEMENT_NODE) {
      updateAttributes(target, source)
    } else if (target.nodeType === TEXT_NODE) {
      target.nodeValue = source.nodeValue
    }
    
    // if target has extra children, remove them
    let len = target.childNodes.length
    let extra = len - source.childNodes.length
    if (extra) {
      for (; extra > 0; extra--) {
        target.removeChild(target.childNodes[len - extra]) 
      }
    }

    // iterate each source child, and morph to target child
    len = source.childNodes.length
    for (let x = 0; x < len; x++) {
      const node = source.childNodes[x]
      if (!target.childNodes[x]) {
        target.appendChild(node.cloneNode(true))
      } else if (target.childNodes[x].nodeName !== source.childNodes[x].nodeName) {
        target.replaceChild(source.childNodes[x].cloneNode(true), target.childNodes[x])
      } else {
        updateElement(target.childNodes[x], source.childNodes[x])
      }
    }

    return target
  }

  // export a unique element factory function for most tags
  const tags = ['a', 'abbr', 'acronym', 'address', 'article', 'aside', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'del', 'div', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'img', 'input', 'ins', 'label', 'legend', 'li', 'link', 'main', 'meta', 'nav', 'ol', 'optgroup', 'option', 'p', 'param', 'picture', 'pre', 'progress', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'ul', 'video']

  return tags.reduce(function (acc, tag) {
    acc[tag] = createElement.bind(null, tag)
    return acc
  }, {
    updateElement: updateElement
  })
}))
