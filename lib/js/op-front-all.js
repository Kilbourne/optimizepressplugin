/*!
 * SelectNav.js (v. 0.1.2)
 * Converts your <ul>/<ol> navigation into a dropdown list for small screens
 * https://github.com/lukaszfiszer/selectnav.js
 *
 * modified by Luka Peharda (if sub nav was empty "undefined" was returned instead of empty string)
 * modified by Zoran Jambor (added check to ensure that addEventListener doesn't break the script if there's no element to attach it to)
 * modified by Zoran Jambor (removed navigation item from the list; it was automatically added to list by the script)
 */
window.selectnav = function() {
    "use strict";
    var e = function(e, t) {
        function c(e) {
            var t;
            if (!e) e = window.event;
            if (e.target) t = e.target;
            else if (e.srcElement) t = e.srcElement;
            if (t.nodeType === 3) t = t.parentNode;
            if (t.value) window.location.href = t.value
        }

        function h(e) {
            var t = e.nodeName.toLowerCase();
            return t === "ul" || t === "ol"
        }

        function p(e) {
            for (var t = 1; document.getElementById("selectnav" + t); t++);
            return e ? "selectnav" + t : "selectnav" + (t - 1)
        }

        function d(e) {
            a++;
            var t = e.children.length,
                n = "",
                l = "",
                c = a - 1;
            if (!t) {
                a--;
                return ''
            }
            if (c) {
                while (c--) {
                    l += o
                }
                l += " "
            }
            for (var v = 0; v < t; v++) {
                var m = e.children[v].children[0];
                if (typeof m !== "undefined") {
                    var g = m.innerText || m.textContent;
                    var y = "";
                    if (r) {
                        y = m.className.search(r) !== -1 || m.parentNode.className.search(r) !== -1 ? f : ""
                    }
                    if (i && !y) {
                        y = m.href === document.URL ? f : ""
                    }
                    n += '<option value="' + m.href + '" ' + y + ">" + l + g + "</option>";
                    if (s) {
                        var b = e.children[v].children[1];
                        if (b && h(b)) {
                            n += d(b)
                        }
                    }
                }
            }
            if (a === 1 && u) {
                n = '<option value="">' + u + "</option>" + n
            }
            if (a === 1) {
                n = '<select class="selectnav dk" name="op_dropdown" tabindex="1" id="' + p(true) + '">' + n + "</select>"
            }
            a--;
            return n
        }
        e = document.getElementById(e);
        if (!e) {
            return
        }
        if (!h(e)) {
            return
        }
        if (!("insertAdjacentHTML" in window.document.documentElement)) {
            return
        }
        document.documentElement.className += " js";
        var n = t || {},
            r = n.activeclass || "active",
            i = typeof n.autoselect === "boolean" ? n.autoselect : true,
            s = typeof n.nested === "boolean" ? n.nested : true,
            o = n.indent || "→",
            u = n.label || "",
            a = 0,
            f = " selected ";
        e.insertAdjacentHTML("afterend", d(e));
        var l = document.getElementById(p());
        if (l && l.addEventListener) {
            l.addEventListener("change", c)
        }
        if (l && l.attachEvent) {
            l.attachEvent("onchange", c)
        }
        return l
    };
    return function(t, n) {
        e(t, n)
    }
}()
;
/*!
 * DropKick 2.0.2
 *
 * Highly customizable <select> lists
 * https://github.com/robdel12/DropKick
 *
*/

(function( $, window, document, undefined ) {

window.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent );
window.isIframe = (window.parent != window.self && location.host === parent.location.host);

var

  // Cache of DK Objects
  dkCache = {},
  dkIndex = 0,

  // The Dropkick Object
  Dropkick = function( sel, opts ) {
    var i;

    // Prevent DK on mobile
    if ( window.isMobile && !opts.mobile ) {
      return false;
    }

    // Safety if `Dropkick` is called without `new`
    if ( this === window ) {
      return new Dropkick( sel, opts );
    }

    if ( typeof sel === "string" && sel[0] === "#" ) {
      sel = document.getElementById( sel.substr( 1 ) );
    }

    // Check if select has already been DK'd and return the DK Object
    if ( i = sel.getAttribute( "data-dkcacheid" ) ) {
      _.extend( dkCache[ i ].data.settings, opts );
      return dkCache[ i ];
    }

    if ( sel.nodeName === "SELECT" ) {
      return this.init( sel, opts );
    }
  },

  noop = function() {},

  // DK default options
  defaults = {

    // Called once after the DK element is inserted into the DOM
    initialize: noop,

    // Called every time the select changes value
    change: noop,

    // Called every time the DK element is opened
    open: noop,

    // Called every time the DK element is closed
    close: noop,

    // Search method; "strict", "partial", or "fuzzy"
    search: "strict"
  },

  // Common Utilities
  _ = {

    hasClass: function( elem, classname ) {
      var reg = new RegExp( "(^|\\s+)" + classname + "(\\s+|$)" );
      return elem && reg.test( elem.className );
    },

    addClass: function( elem, classname ) {
      if( elem && !_.hasClass( elem, classname ) ) {
        elem.className += " " + classname;
      }
    },

    removeClass: function( elem, classname ) {
      var reg = new RegExp( "(^|\\s+)" + classname + "(\\s+|$)" );
      elem && ( elem.className = elem.className.replace( reg, " " ) );
    },

    toggleClass: function( elem, classname ) {
      var fn = _.hasClass( elem, classname ) ? "remove" : "add";
      _[ fn + "Class" ]( elem, classname );
    },

    // Shallow object extend
    extend: function( obj ) {
      Array.prototype.slice.call( arguments, 1 ).forEach( function( source ) {
        if ( source ) for ( var prop in source ) obj[ prop ] = source[ prop ];
      });

      return obj;
    },

    // Returns the top and left offset of an element
    offset: function( elem ) {
      var box = elem.getBoundingClientRect() || { top: 0, left: 0 },
        docElem = document.documentElement;

      return {
        top: box.top + window.pageYOffset - docElem.clientTop,
        left: box.left + window.pageXOffset - docElem.clientLeft
      };
    },

    // Returns the top and left position of an element relative to an ancestor
    position: function( elem, relative ) {
      var pos = { top: 0, left: 0 };

      while ( elem !== relative ) {
        pos.top += elem.offsetTop;
        pos.left += elem.offsetLeft;
        elem = elem.parentNode;
      }

      return pos;
    },

    // Returns the closest ancestor element of the child or false if not found
    closest: function( child, ancestor ) {
      while ( child ) {
        if ( child === ancestor ) return child;
        child = child.parentNode;
      }
      return false;
    },

    // Creates a DOM node with the specified attributes
    create: function( name, attrs ) {
      var a, node = document.createElement( name );

      if ( !attrs ) attrs = {};

      for ( a in attrs ) {
        if ( attrs.hasOwnProperty( a ) ) {
          if ( a == "innerHTML" ) {
            node.innerHTML = attrs[ a ];
          } else {
            node.setAttribute( a, attrs[ a ] );
          }
        }
      }

      return node;
    }
  };


// Extends the DK objects's Prototype
Dropkick.prototype = {

  // Emulate some of HTMLSelectElement's methods

  /**
   * Adds an element to the select
   * @param {Node}         elem   HTMLOptionElement
   * @param {Node/Integer} before HTMLOptionElement/Index of Element
   */
  add: function( elem, before ) {
    var text, option, i;

    if ( typeof elem === "string" ) {
      text = elem;
      elem = document.createElement("option");
      elem.text = text;
    }

    if ( elem.nodeName === "OPTION" ) {
      option = _.create( "li", {
        "class": "dk-option",
        "data-value": elem.value,
        "innerHTML": elem.text,
        "role": "option",
        "aria-selected": "false",
        "id": "dk" + this.data.cacheID + "-" + ( elem.id || elem.value.replace( " ", "-" ) )
      });

      _.addClass( option, elem.className );
      this.length += 1;

      if ( elem.disabled ) {
        _.addClass( option, "dk-option-disabled" );
        option.setAttribute( "aria-disabled", "true" );
      }

      this.data.select.add( elem, before );

      if ( typeof before === "number" ) {
        before = this.item( before );
      }

      if ( this.options.indexOf( before ) > -1 ) {
        before.parentNode.insertBefore( option, before );
      } else {
        this.data.elem.lastChild.appendChild( option );
      }

      option.addEventListener( "mouseover", this );

      i = this.options.indexOf( before );
      this.options.splice( i, 0, option );

      if ( elem.selected ) {
        this.select( i );
      }
    }
  },

  /**
   * Selects an option in the lists at the desired index
   * (negative numbers select from the end)
   * @param  {Integer} index Index of element (positive or negative)
   * @return {Node}          The DK option from the list, or null if not found
   */
  item: function( index ) {
    index = index < 0 ? this.options.length + index : index;
    return this.options[ index ] || null;
  },

  /**
   * Removes an element at the given index
   * @param  {Integer} index Index of element (positive or negative)
   */
  remove: function( index ) {
    var dkOption = this.item( index );
    dkOption.parentNode.removeChild( dkOption );
    this.options.splice( index, 1 );
    this.data.select.remove( index );
    this.select( this.data.select.selectedIndex );
    this.length -= 1;
  },

  /**
   * Initializes the DK Object
   * @param  {Node}   sel  [description]
   * @param  {Object} opts Options to override defaults
   * @return {Object}      The DK Object
   */
  init: function( sel, opts ) {
    var i,
      dk =  Dropkick.build( sel, "dk" + dkIndex );

    // Set some data on the DK Object
    this.data = {};
    this.data.select = sel;
    this.data.elem = dk.elem;
    this.data.settings = _.extend({}, defaults, opts );

    // Emulate some of HTMLSelectElement's properties
    this.disabled = sel.disabled;
    this.form = sel.form;
    this.length = sel.length;
    this.multiple = sel.multiple;
    this.options = dk.options.slice( 0 );
    this.selectedIndex = sel.selectedIndex;
    this.selectedOptions = dk.selected.slice( 0 );
    this.value = sel.value;

    // Insert the DK element before the original select
    sel.parentNode.insertBefore( this.data.elem, sel );

    // Bind events
    this.data.elem.addEventListener( "click", this );
    this.data.elem.addEventListener( "keydown", this );
    this.data.elem.addEventListener( "keypress", this );

    if ( this.form ) {
      this.form.addEventListener( "reset", this );
    }

    if ( !this.multiple ) {
      for ( i = 0; i < this.options.length; i++ ) {
        this.options[ i ].addEventListener( "mouseover", this );
      }
    }

    if ( dkIndex === 0 ) {
      document.addEventListener( "click", Dropkick.onDocClick );
      if ( window.isIframe ){
        parent.document.addEventListener( "click", Dropkick.onDocClick );
      }
    }

    // Add the DK Object to the cache
    this.data.cacheID = dkIndex;
    sel.setAttribute( "data-dkCacheId", this.data.cacheID );
    dkCache[ this.data.cacheID ] = this;

    // Call the optional initialize function
    this.data.settings.initialize.call( this );

    // Increment the index
    dkIndex += 1;

    return this;
  },

  /**
   * Closes the DK dropdown
   */
  close: function() {
    var dk = this.data.elem;

    if ( !this.isOpen || this.multiple ) {
      return false;
    }

    for ( i = 0; i < this.options.length; i++ ) {
      _.removeClass( this.options[ i ], "dk-option-highlight" );
    }

    dk.lastChild.setAttribute( "aria-expanded", "false" );
    _.removeClass( dk.lastChild, "dk-select-options-highlight" );
    _.removeClass( dk, "dk-select-open-(up|down)" );
    this.isOpen = false;

    this.data.settings.close.call( this );
  },

  /**
   * Opens the DK dropdown
   */
  open: function() {
    var dropHeight, above, below,
      dk = this.data.elem,
      dkOptsList = dk.lastChild,
      dkTop = _.offset( dk ).top - window.scrollY,
      dkBottom = window.innerHeight - ( dkTop + dk.offsetHeight );

    if ( this.isOpen || this.multiple ) return false;

    dkOptsList.style.display = "block";
    dropHeight = dkOptsList.offsetHeight;
    dkOptsList.style.display = "";

    above = dkTop > dropHeight;
    below = dkBottom > dropHeight;
    direction = above && !below ? "-up" : "-down";

    this.isOpen = true;
    _.addClass( dk, "dk-select-open" + direction );
    dkOptsList.setAttribute( "aria-expanded", "true" );
    this._scrollTo( this.options.length - 1 );
    this._scrollTo( this.selectedIndex );

    this.data.settings.open.call( this );
  },

  /**
   * Disables or enables an option or the entire Dropkick
   * @param  {Node/Integer} elem     The element or index to disable
   * @param  {Boolean}      disabled Value of disabled
   */
  disable: function( elem, disabled ) {
    var disabledClass = "dk-option-disabled";

    if ( arguments.length == 0 || typeof elem === "boolean" ) {
      disabled = elem === undefined ? true : false;
      elem = this.data.elem;
      disabledClass = "dk-select-disabled";
      this.disabled = disabled;
    }

    if ( disabled == undefined ) {
      disabled = true;
    }

    if ( typeof elem === "number" ) {
      elem = this.item( elem );
    }

    _[ disabled ? "addClass" : "removeClass" ]( elem, disabledClass );
  },

  /**
   * Selects an option from the list
   * @param  {Node/Integer/String} elem     The element, index, or value to select
   * @param  {Boolean}             disabled Selects disabled options
   * @return {Node}                         The selected element
   */
  select: function( elem, disabled ) {
    var i, index, option, combobox,
      select = this.data.select;

    if ( typeof elem === "number" ) {
      elem = this.item( elem );
    }

    if ( typeof elem === "string" ) {
      for ( i = 0; i < this.length; i++ ) {
        if ( this.options[ i ].getAttribute( "data-value" ) == elem ) {
          elem = this.options[ i ];
        } else {
          return false;
        }
      }
    }

    if ( !disabled && _.hasClass( elem, "dk-option-disabled" ) ) return false;

    if ( _.hasClass( elem, "dk-option" ) ) {
      index = this.options.indexOf( elem );
      option = select.options[ index ];

      if ( this.multiple ) {
        _.toggleClass( elem, "dk-option-selected" );
        option.selected = !option.selected;

        if ( _.hasClass( elem, "dk-option-selected" ) ) {
          elem.setAttribute( "aria-selected", "true" );
          this.selectedOptions.push( elem );
        } else {
          elem.setAttribute( "aria-selected", "false" );
          index = this.selectedOptions.indexOf( elem );
          this.selectedOptions.splice( index, 1 );
        }
      } else {
        combobox = this.data.elem.firstChild;

        if ( this.selectedOptions.length ) {
          _.removeClass( this.selectedOptions[0], "dk-option-selected" );
          this.selectedOptions[0].setAttribute( "aria-selected", "false" );
        }

        _.addClass( elem, "dk-option-selected" );
        elem.setAttribute( "aria-selected", "true" );

        combobox.setAttribute( "aria-activedescendant", elem.id );
        combobox.innerHTML = option.text;

        this.selectedOptions[0] = elem;
        option.selected = true;
      }

      this.selectedIndex = select.selectedIndex;
      this.value = select.value;
      this.data.settings.change.call( this );

      return elem;
    }
  },

  /**
   * Selects a single option from the list
   * @param  {Node/Integer} elem     The element or index to select
   * @param  {Boolean}      disabled Selects disabled options
   * @return {Node}                  The selected element
   */
  selectOne: function( elem, disabled ) {
    this.reset( true );
    this._scrollTo( elem );
    return this.select( elem, disabled );
  },

  /**
   * Finds all options who's text matches a pattern (strict, partial, or fuzzy)
   * @param  {String} string  The string to search for
   * @param  {Integer} mode   How to search; "strict", "partial", or "fuzzy"
   * @return {Array/Boolean}  An Array of matched elements
   */
  search: function( pattern, mode ) {
    var i, tokens, str, tIndex, sIndex, cScore, tScore, reg,
      options = this.data.select.options,
      matches = [];

    if ( !pattern ) return this.options;

    // Fix Mode
    mode = mode ? mode.toLowerCase() : "strict";
    mode = mode == "fuzzy" ? 2 : mode == "partial" ? 1 : 0;

    reg = new RegExp( ( mode ? "" : "^" ) + pattern, "i" );

    for ( i = 0; i < options.length; i++ ) {
      str = options[ i ].text.toLowerCase();

      // Fuzzy
      if ( mode == 2 ) {
        tokens = pattern.toLowerCase().split("");
        tIndex = sIndex = cScore = tScore = 0;

        while ( sIndex < str.length ) {
          if ( str[ sIndex ] === tokens[ tIndex ] ) {
            cScore += 1 + cScore;
            tIndex++;
          } else {
            cScore = 0;
          }

          tScore += cScore;
          sIndex++;
        }

        if ( tIndex == tokens.length ) {
          matches.push({ e: this.options[ i ], s: tScore, i: i });
        }

      // Partial or Strict (Default)
      } else {
        reg.test( str ) && matches.push( this.options[ i ] );
      }
    }

    // Sort fuzzy results
    if ( mode == 2 ) {
      matches = matches.sort( function ( a, b ) {
        return ( b.s - a.s ) || a.i - b.i;
      }).reduce( function ( p, o ) {
        p[ p.length ] = o.e;
        return p;
      }, [] );
    }

    return matches;
  },

  /**
   * Resets the DK and select element
   * @param  {Boolean} clear Defaults to first option if True
   */
  reset: function( clear ) {
    var i,
      select = this.data.select;

    this.selectedOptions.length = 0;

    for ( i = 0; i < select.options.length; i++ ) {
      select.options[ i ].selected = false;
      _.removeClass( this.options[ i ], "dk-option-selected" );
      this.options[ i ].setAttribute( "aria-selected", "false" );
      if ( !clear && select.options[ i ].defaultSelected ) {
        this.select( i, true );
      }
    }

    if ( !this.selectedOptions.length && !this.multiple ) {
      this.select( 0, true );
    }
  },

  /**
   * Rebuilds the DK Object
   * (use if HTMLSelectElement has changed)
   */
  refresh: function() {
    this.dispose().init( this.data.select, this.data.settings );
  },

  /**
   * Removes the DK Object from the cache and the element from the DOM
   */
  dispose: function() {
    delete dkCache[ this.data.cachID ];
    this.data.elem.parentNode.removeChild( this.data.elem );
    this.data.select.removeAttribute( "data-dkCacheId" );
    return this;
  },

  // Private Methods

  handleEvent: function( event ) {
    if ( this.disabled ) return;

    switch ( event.type ) {
    case "click":
      this._delegate( event );
      break;
    case "keydown":
      this._keyHandler( event );
      break;
    case "keypress":
      this._searchOptions( event );
      break;
    case "mouseover":
      this._highlight( event );
      break;
    case "reset":
      this.reset();
      break;
    }
  },

  _delegate: function( event ) {
    var selection, index, firstIndex, lastIndex,
      target = event.target;

    if ( _.hasClass( target, "dk-option-disabled" ) ) {
      return false;
    }

    if ( !this.multiple ) {
      this[ this.isOpen ? "close" : "open" ]();
      if ( _.hasClass( target, "dk-option" ) ) this.select( target );
    } else {
      if ( _.hasClass( target, "dk-option" ) ) {
        selection = window.getSelection();
        if ( selection.type == "Range" ) selection.collapseToStart();

        if ( event.shiftKey ) {
          firstIndex = this.options.indexOf( this.selectedOptions[0] );
          lastIndex = this.options.indexOf( this.selectedOptions[ this.selectedOptions.length - 1 ] );
          index =  this.options.indexOf( target );

          if ( index > firstIndex && index < lastIndex ) index = firstIndex;
          if ( index > lastIndex && lastIndex > firstIndex ) lastIndex = firstIndex;

          this.reset( true );

          if ( lastIndex > index ) {
            while ( index < lastIndex + 1 ) this.select( index++ );
          } else {
            while ( index > lastIndex - 1 ) this.select( index-- );
          }
        } else if ( event.ctrlKey || event.metaKey ) {
          this.select( target );
        } else {
          this.reset( true );
          this.select( target );
        }
      }
    }
  },

  _highlight: function( event ) {
    var i, option = event.target;

    if ( !this.multiple ) {
      for ( i = 0; i < this.options.length; i++ ) {
        _.removeClass( this.options[ i ], "dk-option-highlight" );
      }

      _.addClass( this.data.elem.lastChild, "dk-select-options-highlight" );
      _.addClass( option, "dk-option-highlight" );
    }
  },

  _keyHandler: function( event ) {
    var lastSelected,
      selected = this.selectedOptions,
      options = this.options,
      i = 1,
      keys = {
        tab: 9,
        enter: 13,
        esc: 27,
        space: 32,
        up: 38,
        down: 40
      };

    switch ( event.keyCode ) {
    case keys.up:
      i = -1;
      // deliberate fallthrough
    case keys.down:
      event.preventDefault();
      lastSelected = selected[ selected.length - 1 ];
      i = options.indexOf( lastSelected ) + i;

      if ( i > options.length - 1 ) {
        i = options.length - 1;
      } else if ( i < 0 ) {
        i = 0;
      }

      if ( !this.data.select.options[ i ].disabled ) {
        this.reset( true );
        this.select( i );
        this._scrollTo( i );
      }
      break;
    case keys.space:
      if ( !this.isOpen ) {
        event.preventDefault();
        this.open();
        break;
      }
      // deliberate fallthrough
    case keys.tab:
    case keys.enter:
      for ( i = 0; i < options.length; i++ ) {
        if ( _.hasClass( options[ i ], "dk-option-highlight" ) ) {
          this.select( i );
        }
      }
      // deliberate fallthrough
    case keys.esc:
      if ( this.isOpen ) {
        event.preventDefault();
        this.close();
      }
      break;
    }
  },

  _searchOptions: function( event ) {
    var results,
      self = this,
      keyChar = String.fromCharCode( event.keyCode || event.which ),

      waitToReset = function() {
        if ( self.data.searchTimeout ) {
          clearTimeout( self.data.searchTimeout );
        }

        self.data.searchTimeout = setTimeout(function() {
          self.data.searchString = "";
        }, 1000 );
      };

    if ( this.data.searchString === undefined ) {
      this.data.searchString = "";
    }

    waitToReset();

    this.data.searchString += keyChar;
    results = this.search( this.data.searchString, this.data.settings.search );

    if ( results.length ) {
      if ( !_.hasClass( results[0], "dk-option-disabled" ) ) {
        this.selectOne( results[0] );
      }
    }
  },

  _scrollTo: function( option ) {
    var optPos, optTop, optBottom,
      dkOpts = this.data.elem.lastChild;

    if ( !this.isOpen && !this.multiple ) {
      return false;
    }

    if ( typeof option === "number" ) {
      option = this.item( option );
    }

    optPos = _.position( option, dkOpts ).top;
    optTop = optPos - dkOpts.scrollTop;
    optBottom = optTop + option.offsetHeight;

    if ( optBottom > dkOpts.offsetHeight ) {
      optPos += option.offsetHeight;
      dkOpts.scrollTop = optPos - dkOpts.offsetHeight;
    } else if ( optTop < 0 ) {
      dkOpts.scrollTop = optPos;
    }
  }
};

// Static Methods

/**
 * Builds the Dropkick element from a select element
 * @param  {Node} sel The HTMLSelectElement
 * @return {Object}   An object containing the new DK element and it's options
 */
Dropkick.build = function( sel, idpre ) {
  var optList, i,
    options = [],

    ret = {
      elem: null,
      options: [],
      selected: []
    },

    addOption = function ( node ) {
      var option, optgroup, optgroupList, i,
        children = [];

      switch ( node.nodeName ) {
      case "OPTION":
        option = _.create( "li", {
          "class": "dk-option",
          "data-value": node.value,
          "innerHTML": node.text,
          "role": "option",
          "aria-selected": "false",
          "id": idpre + "-" + ( node.id || node.value.replace( " ", "-" ) )
        });

        _.addClass( option, node.className );

        if ( node.disabled ) {
          _.addClass( option, "dk-option-disabled" );
          option.setAttribute( "aria-disabled", "true" );
        }

        if ( node.selected ) {
          _.addClass( option, "dk-option-selected" );
          option.setAttribute( "aria-selected", "true" );
          ret.selected.push( option );
        }

        ret.options.push( this.appendChild( option ) );
        break;
      case "OPTGROUP":
        optgroup = _.create( "li", { "class": "dk-optgroup" });

        if ( node.label ) {
          optgroup.appendChild( _.create( "div", {
            "class": "dk-optgroup-label",
            "innerHTML": node.label
          }));
        }

        optgroupList = _.create( "ul", {
          "class": "dk-optgroup-options",
        });

        for ( i = node.children.length; i--; children.unshift( node.children[ i ] ) );
        children.forEach( addOption, optgroupList );

        this.appendChild( optgroup ).appendChild( optgroupList );
        break;
      }
    };

  ret.elem = _.create( "div", {
    "class": "dk-select" + ( sel.multiple ? "-multi" : "" )
  });

  optList = _.create( "ul", {
    "class": "dk-select-options",
    "id": idpre + "-listbox",
    "role": "listbox"
  });

  sel.disabled && _.addClass( ret.elem, "dk-select-disabled" );
  ret.elem.id = idpre + ( sel.id ? "-" + sel.id : "" );
  _.addClass( ret.elem, sel.className );

  if ( !sel.multiple ) {
    ret.elem.appendChild( _.create( "div", {
      "class": "dk-selected",
      "tabindex": sel.tabindex || 0,
      "innerHTML": sel.options[ sel.selectedIndex ].text,
      "id": idpre + "-combobox",
      "aria-live": "assertive",
      "aria-owns": optList.id,
      "role": "combobox"
    }));
    optList.setAttribute( "aria-expanded", "false" );
  } else {
    ret.elem.setAttribute( "tabindex", sel.getAttribute( "tabindex" ) || "0" );
    optList.setAttribute( "aria-multiselectable", "true" );
  }

  for ( i = sel.children.length; i--; options.unshift( sel.children[ i ] ) );
  options.forEach( addOption, ret.elem.appendChild( optList ) );

  return ret;
};

/**
 * Focus DK Element when corresponding label is clicked; close all other DK's
 */
Dropkick.onDocClick = function( event ) {
  var t, tId, i;

  if ( t = document.getElementById( event.target.htmlFor ) ) {
    if ( ( tId = t.getAttribute( "data-dkcacheid" ) ) !== null ) {
      dkCache[ tId ].data.elem.focus();
    }
  }

  for ( i in dkCache ) {
    if ( !_.closest( event.target, dkCache[ i ].data.elem ) ) {
      dkCache[ i ].disabled || dkCache[ i ].close();
    }
  }
};


/**
 * Without this part taken from Dropkick v1, we have issues with scrolling element list in live editor in fancybox in chrome (but not in Firefox).
 */
// Prevents window scroll when scrolling  through dk_options, simulating native behaviour
var wheelSupport =  'onwheel' in window ? 'wheel' : // Modern browsers support "wheel"
  'onmousewheel' in document ? 'mousewheel' : // Webkit and IE support at least "mousewheel"
  "MouseScrollEvent" in window ? 'DOMMouseScroll MozMousePixelScroll' : // legacy non-standard event for older Firefox
  false // lacks support
;
wheelSupport && $(document).on(wheelSupport, '.dk_options_inner', function(event) {
  var delta = event.originalEvent.wheelDelta || -event.originalEvent.deltaY || -event.originalEvent.detail; // Gets scroll ammount
  if (msie) { this.scrollTop -= Math.round(delta/10); return false; } // Normalize IE behaviour
  return (delta > 0 && this.scrollTop <= 0 ) || (delta < 0 && this.scrollTop >= this.scrollHeight - this.offsetHeight ) ? false : true; // Finally cancels page scroll when nedded
});

// Expose Dropkick Globally
window.Dropkick = Dropkick;

})( opjq, window, document );


opjq.fn.dropkick = function () {
  var args = Array.prototype.slice.call( arguments );
  return opjq( this ).each(function() {
    if ( !args[0] || typeof args[0] === 'object' ) {
      new Dropkick( this, args[0] || {} );
    } else if ( typeof args[0] === 'string' ) {
      Dropkick.prototype[ args[0] ].apply( new Dropkick( this ), args.slice( 1 ) );
    }
  });
};;
/*!
 *  Sharrre.com - Make your sharing widget!
 *  Version: beta 1.3.5
 *  Author: Julien Hany
 *  License: MIT http://en.wikipedia.org/wiki/MIT_License or GPLv2 http://en.wikipedia.org/wiki/GNU_General_Public_License
 */
!function(a,b,c,d){function f(b,c){this.element=b,this.options=a.extend(!0,{},h,c),this.options.share=c.share,this._defaults=h,this._name=g,this.init()}var g="sharrre",h={className:"sharrre",share:{googlePlus:!1,facebook:!1,twitter:!1,digg:!1,delicious:!1,stumbleupon:!1,linkedin:!1,pinterest:!1},shareTotal:0,template:"",title:"",url:c.location.href,text:c.title,urlCurl:"sharrre.php",count:{},total:0,shorterTotal:!0,enableHover:!0,enableCounter:!0,enableTracking:!1,hover:function(){},hide:function(){},click:function(){},render:function(){},buttons:{googlePlus:{url:"",urlCount:!1,size:"medium",lang:"en-US",annotation:""},facebook:{url:"",urlCount:!1,action:"like",layout:"button_count",width:"",send:"false",faces:"false",colorscheme:"",font:"",lang:"en_US"},twitter:{url:"",urlCount:!1,count:"horizontal",hashtags:"",via:"",related:"",lang:"en"},digg:{url:"",urlCount:!1,type:"DiggCompact"},delicious:{url:"",urlCount:!1,size:"medium"},stumbleupon:{url:"",urlCount:!1,layout:"1"},linkedin:{url:"",urlCount:!1,counter:""},pinterest:{url:"",media:"",description:"",layout:"horizontal"}}},i={googlePlus:"",facebook:"",twitter:"",digg:"http://services.digg.com/2.0/story.getInfo?links={url}&type=javascript&callback=?",delicious:"http://feeds.delicious.com/v2/json/urlinfo/data?url={url}&callback=?",stumbleupon:"",linkedin:"http://www.linkedin.com/countserv/count/share?format=jsonp&url={url}&callback=?",pinterest:"http://api.pinterest.com/v1/urls/count.json?url={url}&callback=?"},j={googlePlus:function(d){var e=d.options.buttons.googlePlus;a(d.element).find(".buttons").append('<div class="button googleplus"><div class="g-plusone" data-size="'+e.size+'" data-href="'+(""!==e.url?e.url:d.options.url)+'" data-annotation="'+e.annotation+'"></div></div>'),b.___gcfg={lang:d.options.buttons.googlePlus.lang};var f=0;"undefined"==typeof gapi&&0==f?(f=1,function(){var a=c.createElement("script");a.type="text/javascript",a.async=!0,a.src="//apis.google.com/js/plusone.js";var b=c.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}()):gapi.plusone.go()},facebook:function(b){var d=b.options.buttons.facebook;a(b.element).find(".buttons").append('<div class="button facebook"><div id="fb-root"></div><div class="fb-like" data-href="'+(""!==d.url?d.url:b.options.url)+'" data-send="'+d.send+'" data-layout="'+d.layout+'" data-width="'+d.width+'" data-show-faces="'+d.faces+'" data-action="'+d.action+'" data-colorscheme="'+d.colorscheme+'" data-font="'+d.font+'" data-via="'+d.via+'"></div></div>');var e=0;"undefined"==typeof FB&&0==e?(e=1,function(a,b,c){var e,f=a.getElementsByTagName(b)[0];a.getElementById(c)||(e=a.createElement(b),e.id=c,e.src="//connect.facebook.net/"+d.lang+"/all.js#xfbml=1",f.parentNode.insertBefore(e,f))}(c,"script","facebook-jssdk")):FB.XFBML.parse()},twitter:function(b){var d=b.options.buttons.twitter;a(b.element).find(".buttons").append('<div class="button twitter"><a href="https://twitter.com/share" class="twitter-share-button" data-url="'+(""!==d.url?d.url:b.options.url)+'" data-count="'+d.count+'" data-text="'+b.options.text+'" data-via="'+d.via+'" data-hashtags="'+d.hashtags+'" data-related="'+d.related+'" data-lang="'+d.lang+'">Tweet</a></div>');var e=0;"undefined"==typeof twttr&&0==e?(e=1,function(){var a=c.createElement("script");a.type="text/javascript",a.async=!0,a.src="//platform.twitter.com/widgets.js";var b=c.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}()):a.ajax({url:"//platform.twitter.com/widgets.js",dataType:"script",cache:!0})},digg:function(b){var d=b.options.buttons.digg;a(b.element).find(".buttons").append('<div class="button digg"><a class="DiggThisButton '+d.type+'" rel="nofollow external" href="http://digg.com/submit?url='+encodeURIComponent(""!==d.url?d.url:b.options.url)+'"></a></div>');var e=0;"undefined"==typeof __DBW&&0==e&&(e=1,function(){var a=c.createElement("SCRIPT"),b=c.getElementsByTagName("SCRIPT")[0];a.type="text/javascript",a.async=!0,a.src="//widgets.digg.com/buttons.js",b.parentNode.insertBefore(a,b)}())},delicious:function(b){if("tall"==b.options.buttons.delicious.size)var c="width:50px;",d="height:35px;width:50px;font-size:15px;line-height:35px;",e="height:18px;line-height:18px;margin-top:3px;";else var c="width:93px;",d="float:right;padding:0 3px;height:20px;width:26px;line-height:20px;",e="float:left;height:20px;line-height:20px;";var f=b.shorterTotal(b.options.count.delicious);"undefined"==typeof f&&(f=0),a(b.element).find(".buttons").append('<div class="button delicious"><div style="'+c+'font:12px Arial,Helvetica,sans-serif;cursor:pointer;color:#666666;display:inline-block;float:none;height:20px;line-height:normal;margin:0;padding:0;text-indent:0;vertical-align:baseline;"><div style="'+d+'background-color:#fff;margin-bottom:5px;overflow:hidden;text-align:center;border:1px solid #ccc;border-radius:3px;">'+f+'</div><div style="'+e+'display:block;padding:0;text-align:center;text-decoration:none;width:50px;background-color:#7EACEE;border:1px solid #40679C;border-radius:3px;color:#fff;"><img src="http://www.delicious.com/static/img/delicious.small.gif" height="10" width="10" alt="Delicious" /> Add</div></div></div>'),a(b.element).find(".delicious").on("click",function(){b.openPopup("delicious")})},stumbleupon:function(d){var e=d.options.buttons.stumbleupon;a(d.element).find(".buttons").append('<div class="button stumbleupon"><su:badge layout="'+e.layout+'" location="'+(""!==e.url?e.url:d.options.url)+'"></su:badge></div>');var f=0;"undefined"==typeof STMBLPN&&0==f?(f=1,function(){var a=c.createElement("script");a.type="text/javascript",a.async=!0,a.src="//platform.stumbleupon.com/1/widgets.js";var b=c.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}(),s=b.setTimeout(function(){"undefined"!=typeof STMBLPN&&(STMBLPN.processWidgets(),clearInterval(s))},500)):STMBLPN.processWidgets()},linkedin:function(d){var e=d.options.buttons.linkedin;a(d.element).find(".buttons").append('<div class="button linkedin"><script type="in/share" data-url="'+(""!==e.url?e.url:d.options.url)+'" data-counter="'+e.counter+'"></script></div>');var f=0;"undefined"==typeof b.IN&&0==f?(f=1,function(){var a=c.createElement("script");a.type="text/javascript",a.async=!0,a.src="//platform.linkedin.com/in.js";var b=c.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}()):b.IN.init()},pinterest:function(b){var d=b.options.buttons.pinterest;a(b.element).find(".buttons").append('<div class="button pinterest"><a href="http://pinterest.com/pin/create/button/?url='+(""!==d.url?d.url:b.options.url)+"&media="+d.media+"&description="+d.description+'" class="pin-it-button" count-layout="'+d.layout+'">Pin It</a></div>'),function(){var a=c.createElement("script");a.type="text/javascript",a.async=!0,a.src="//assets.pinterest.com/js/pinit.js";var b=c.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}()}},k={googlePlus:function(){},facebook:function(){fb=b.setInterval(function(){"undefined"!=typeof FB&&(FB.Event.subscribe("edge.create",function(a){"function"==typeof ga?ga("send","event","_trackSocial","facebook","like",a):"undefined"!=typeof _gaq&&_gaq.push(["_trackSocial","facebook","like",a])}),FB.Event.subscribe("edge.remove",function(a){"function"==typeof ga?ga("send","event","_trackSocial","facebook","unlike",a):"undefined"!=typeof _gaq&&_gaq.push(["_trackSocial","facebook","unlike",a])}),FB.Event.subscribe("message.send",function(a){"function"==typeof ga?ga("send","event","_trackSocial","facebook","send",a):"undefined"!=typeof _gaq&&_gaq.push(["_trackSocial","facebook","send",a])}),clearInterval(fb))},1e3)},twitter:function(){tw=b.setInterval(function(){"undefined"!=typeof twttr&&(twttr.events.bind("tweet",function(a){a&&("function"==typeof ga?ga("send","event","_trackSocial","twitter","twitter"):"undefined"!=typeof _gaq&&_gaq.push(["_trackSocial","twitter","twitter"]))}),clearInterval(tw))},1e3)},digg:function(){},delicious:function(){},stumbleupon:function(){},linkedin:function(){},pinterest:function(){}},l={googlePlus:function(a){b.open("https://plus.google.com/share?hl="+a.buttons.googlePlus.lang+"&url="+encodeURIComponent(""!==a.buttons.googlePlus.url?a.buttons.googlePlus.url:a.url),"","toolbar=0, status=0, width=900, height=500")},facebook:function(a){b.open("http://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(""!==a.buttons.facebook.url?a.buttons.facebook.url:a.url)+"&t="+a.text,"","toolbar=0, status=0, width=900, height=500")},twitter:function(a){b.open("https://twitter.com/intent/tweet?text="+encodeURIComponent(a.text)+"&url="+encodeURIComponent(""!==a.buttons.twitter.url?a.buttons.twitter.url:a.url)+(""!==a.buttons.twitter.via?"&via="+a.buttons.twitter.via:""),"","toolbar=0, status=0, width=650, height=360")},digg:function(a){b.open("http://digg.com/tools/diggthis/submit?url="+encodeURIComponent(""!==a.buttons.digg.url?a.buttons.digg.url:a.url)+"&title="+a.text+"&related=true&style=true","","toolbar=0, status=0, width=650, height=360")},delicious:function(a){b.open("http://www.delicious.com/save?v=5&noui&jump=close&url="+encodeURIComponent(""!==a.buttons.delicious.url?a.buttons.delicious.url:a.url)+"&title="+a.text,"delicious","toolbar=no,width=550,height=550")},stumbleupon:function(a){b.open("http://www.stumbleupon.com/badge/?url="+encodeURIComponent(""!==a.buttons.delicious.url?a.buttons.delicious.url:a.url),"stumbleupon","toolbar=no,width=550,height=550")},linkedin:function(a){b.open("https://www.linkedin.com/cws/share?url="+encodeURIComponent(""!==a.buttons.delicious.url?a.buttons.delicious.url:a.url)+"&token=&isFramed=true","linkedin","toolbar=no,width=550,height=550")},pinterest:function(a){b.open("http://pinterest.com/pin/create/button/?url="+encodeURIComponent(""!==a.buttons.pinterest.url?a.buttons.pinterest.url:a.url)+"&media="+encodeURIComponent(a.buttons.pinterest.media)+"&description="+a.buttons.pinterest.description,"pinterest","toolbar=no,width=700,height=300")}};f.prototype.init=function(){var b=this;""!==this.options.urlCurl&&(i.googlePlus=this.options.urlCurl+"?url={url}&type=googlePlus",i.stumbleupon=this.options.urlCurl+"?url={url}&type=stumbleupon"),a(this.element).addClass(this.options.className),"undefined"!=typeof a(this.element).data("title")&&(this.options.title=a(this.element).attr("data-title")),"undefined"!=typeof a(this.element).data("url")&&(this.options.url=a(this.element).data("url")),"undefined"!=typeof a(this.element).data("text")&&(this.options.text=a(this.element).data("text")),a.each(this.options.share,function(a,c){c===!0&&b.options.shareTotal++}),b.options.enableCounter===!0?a.each(this.options.share,function(a,c){if(c===!0)try{b.getSocialJson(a)}catch(d){}}):""!==b.options.template?this.options.render(this,this.options):this.loadButtons(),a(this.element).hover(function(){0===a(this).find(".buttons").length&&b.options.enableHover===!0&&b.loadButtons(),b.options.hover(b,b.options)},function(){b.options.hide(b,b.options)}),a(this.element).click(function(){return b.options.click(b,b.options),!1})},f.prototype.loadButtons=function(){var b=this;a(this.element).append('<div class="buttons"></div>'),a.each(b.options.share,function(a,c){1==c&&(j[a](b),b.options.enableTracking===!0&&k[a]())})},f.prototype.getSocialJson=function(b){var c=this,d=0,e=i[b].replace("{url}",encodeURIComponent(this.options.url));this.options.buttons[b].urlCount===!0&&""!==this.options.buttons[b].url&&(e=i[b].replace("{url}",this.options.buttons[b].url)),""!=e&&""!==c.options.urlCurl?a.getJSON(e,function(a){if("undefined"!=typeof a.count){var e=a.count+"";e=e.replace("Â ",""),d+=parseInt(e,10)}else a.data&&a.data.length>0&&"undefined"!=typeof a.data[0].total_count?d+=parseInt(a.data[0].total_count,10):"undefined"!=typeof a[0]?d+=parseInt(a[0].total_posts,10):"undefined"!=typeof a[0];c.options.count[b]=d,c.options.total+=d,c.renderer(),c.rendererPerso()}).error(function(){c.options.count[b]=0,c.rendererPerso()}):(0==c.options.total&&"undefined"!=typeof c.options.buttons[b].likes&&(c.options.total=c.options.buttons[b].likes),c.renderer(),c.options.count[b]=0,c.rendererPerso())},f.prototype.rendererPerso=function(){var a=0;for(e in this.options.count)a++;a===this.options.shareTotal&&this.options.render(this,this.options)},f.prototype.renderer=function(){var b=this.options.total,c=this.options.template;this.options.shorterTotal===!0&&(b=this.shorterTotal(b)),""!==c?(c=c.replace("{total}",b),a(this.element).html(c)):a(this.element).html('<div class="box"><a class="count" href="#">'+b+"</a>"+(""!==this.options.title?'<a class="share" href="#">'+this.options.title+"</a>":"")+"</div>")},f.prototype.shorterTotal=function(a){return a>=1e6?a=(a/1e6).toFixed(2)+"M":a>=1e3&&(a=(a/1e3).toFixed(1)+"k"),a},f.prototype.openPopup=function(a){if(l[a](this.options),this.options.enableTracking===!0){var b={googlePlus:{site:"Google",action:"+1"},facebook:{site:"facebook",action:"like"},twitter:{site:"twitter",action:"tweet"},digg:{site:"digg",action:"add"},delicious:{site:"delicious",action:"add"},stumbleupon:{site:"stumbleupon",action:"add"},linkedin:{site:"linkedin",action:"share"},pinterest:{site:"pinterest",action:"pin"}};"function"==typeof ga?ga("send","event","_trackSocial",b[a].site,b[a].action):"undefined"!=typeof _gaq&&_gaq.push(["_trackSocial",b[a].site,b[a].action])}},f.prototype.simulateClick=function(){var b=a(this.element).html();a(this.element).html(b.replace(this.options.total,this.options.total+1))},f.prototype.update=function(a,b){""!==a&&(this.options.url=a),""!==b&&(this.options.text=b)},a.fn[g]=function(b){var c=arguments;return b===d||"object"==typeof b?this.each(function(){a.data(this,"plugin_"+g)||a.data(this,"plugin_"+g,new f(this,b))}):"string"==typeof b&&"_"!==b[0]&&"init"!==b?this.each(function(){var d=a.data(this,"plugin_"+g);d instanceof f&&"function"==typeof d[b]&&d[b].apply(d,Array.prototype.slice.call(c,1))}):void 0}}(jQuery,window,document);;
/*!
 * jQuery Reveal Plugin 1.0
 * www.ZURB.com
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/
!function(a){a("body").on("click","a[data-reveal-id]",function(b){b.preventDefault();var c=a(this).attr("data-reveal-id");a("#"+c).reveal(a(this).data())}),a.fn.reveal=function(b){var c={animation:"fadeAndPop",animationspeed:300,closeonbackgroundclick:!0,dismissmodalclass:"close-reveal-modal"},b=a.extend({},c,b);return this.each(function(){function c(){h=!1}function d(){h=!0}var e=a(this),f=parseInt(e.css("top")),g=e.height()+f,h=!1,i=a(".reveal-modal-bg");0==i.length&&(i=a('<div class="reveal-modal-bg" />').insertAfter(e)),e.bind("reveal:open",function(){i.unbind("click.modalEvent"),a("."+b.dismissmodalclass).unbind("click.modalEvent"),h||(d(),"fadeAndPop"==b.animation&&(e.css({top:a(document).scrollTop()-g,opacity:0,visibility:"visible"}),i.fadeIn(b.animationspeed/2),e.delay(b.animationspeed/2).animate({top:a(document).scrollTop()+f+"px",opacity:1},b.animationspeed,c())),"fade"==b.animation&&(e.css({opacity:0,visibility:"visible",top:a(document).scrollTop()+f}),i.fadeIn(b.animationspeed/2),e.delay(b.animationspeed/2).animate({opacity:1},b.animationspeed,c())),"none"==b.animation&&(e.css({visibility:"visible",top:a(document).scrollTop()+f}),i.css({display:"block"}),c())),e.unbind("reveal:open")}),e.bind("reveal:close",function(){h||(d(),"fadeAndPop"==b.animation&&(i.delay(b.animationspeed).fadeOut(b.animationspeed),e.animate({top:a(document).scrollTop()-g+"px",opacity:0},b.animationspeed/2,function(){e.css({top:f,opacity:1,visibility:"hidden"}),c()})),"fade"==b.animation&&(i.delay(b.animationspeed).fadeOut(b.animationspeed),e.animate({opacity:0},b.animationspeed,function(){e.css({opacity:1,visibility:"hidden",top:f}),c()})),"none"==b.animation&&(e.css({visibility:"hidden",top:f}),i.css({display:"none"}))),e.unbind("reveal:close")}),e.trigger("reveal:open");a("."+b.dismissmodalclass).bind("click.modalEvent",function(){e.trigger("reveal:close")});b.closeonbackgroundclick&&(i.css({cursor:"pointer"}),i.bind("click.modalEvent",function(){e.trigger("reveal:close")})),a("body").keyup(function(a){27===a.which&&e.trigger("reveal:close")})})}}(opjq);;
/*! http://keith-wood.name/countdown.html
   Countdown for jQuery v1.6.2.
   Written by Keith Wood (kbwood{at}iinet.com.au) January 2008.
   Available under the MIT (https://github.com/jquery/jquery/blob/master/MIT-LICENSE.txt) license.
   Please attribute the author if you use it. */
(function ($) {

	function Countdown() {
		this.regional = [];
		this.regional[''] = {
			labels: ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'],
			labels1: ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minute', 'Second'],
			compactLabels: ['y', 'm', 'w', 'd'],
			whichLabels: null,
			digits: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
			timeSeparator: ':',
			isRTL: false
		};
		this._defaults = {
			until: null,
			since: null,
			timezone: null,
			serverSync: null,
			format: 'dHMS',
			layout: '',
			compact: false,
			significant: 0,
			description: '',
			expiryUrl: '',
			expiryText: '',
			alwaysExpire: false,
			onExpiry: null,
			onTick: null,
			tickInterval: 1
		};
		$.extend(this._defaults, this.regional['']);
		this._serverSyncs = [];

		function timerCallBack(a) {
			var b;
			if (a < 1e12) {
				if (typeof performance !== 'undefined' && performance.now) {
					b = performance.now() + performance.timing.navigationStart;
				} else {
					b = Date.now();
				}
			} else {
				b = a || new Date().getTime();
			}
			if (b - d >= 1000) {
				x._updateTargets();
				d = b
			}
			c(timerCallBack)
		}
		var c = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || null;
		var d = 0;

		// We don't want an active countdown element in live editor,
		// because it causes too much repaints/reflows/requestanimationframes
		if (typeof op_live_editor === 'undefined' || !op_live_editor) {
			if (!c || $.noRequestAnimationFrame) {
				$.noRequestAnimationFrame = null;
				setInterval(function () {
					x._updateTargets()
				}, 980)
			} else {
				d = window.animationStartTime || window.webkitAnimationStartTime || window.mozAnimationStartTime || window.oAnimationStartTime || window.msAnimationStartTime || new Date().getTime();
				c(timerCallBack)
			}
		}
	}
	var Y = 0;
	var O = 1;
	var W = 2;
	var D = 3;
	var H = 4;
	var M = 5;
	var S = 6;
	$.extend(Countdown.prototype, {
		markerClassName: 'hasCountdown',
		propertyName: 'countdown',
		_rtlClass: 'countdown_rtl',
		_sectionClass: 'countdown_section',
		_amountClass: 'countdown_amount',
		_rowClass: 'countdown_row',
		_holdingClass: 'countdown_holding',
		_showClass: 'countdown_show',
		_descrClass: 'countdown_descr',
		_timerTargets: [],
		setDefaults: function (a) {
			this._resetExtraLabels(this._defaults, a);
			$.extend(this._defaults, a || {})
		},
		UTCDate: function (a, b, c, e, f, g, h, i) {
			if (typeof b == 'object' && b.constructor == Date) {
				i = b.getMilliseconds();
				h = b.getSeconds();
				g = b.getMinutes();
				f = b.getHours();
				e = b.getDate();
				c = b.getMonth();
				b = b.getFullYear()
			}
			var d = new Date();
			d.setUTCFullYear(b);
			d.setUTCDate(1);
			d.setUTCMonth(c || 0);
			d.setUTCDate(e || 1);
			d.setUTCHours(f || 0);
			d.setUTCMinutes((g || 0) - (Math.abs(a) < 30 ? a * 60 : a));
			d.setUTCSeconds(h || 0);
			d.setUTCMilliseconds(i || 0);
			return d
		},
		periodsToSeconds: function (a) {
			return a[0] * 31557600 + a[1] * 2629800 + a[2] * 604800 + a[3] * 86400 + a[4] * 3600 + a[5] * 60 + a[6]
		},
		_attachPlugin: function (a, b) {
			a = $(a);
			if (a.hasClass(this.markerClassName)) {
				return
			}
			var c = {
				options: $.extend({}, this._defaults),
				_periods: [0, 0, 0, 0, 0, 0, 0]
			};
			a.addClass(this.markerClassName).data(this.propertyName, c);
			this._optionPlugin(a, b)
		},
		_addTarget: function (a) {
			if (!this._hasTarget(a)) {
				this._timerTargets.push(a)
			}
		},
		_hasTarget: function (a) {
			return ($.inArray(a, this._timerTargets) > -1)
		},
		_removeTarget: function (b) {
			this._timerTargets = $.map(this._timerTargets, function (a) {
				return (a == b ? null : a)
			})
		},
		_updateTargets: function () {
			for (var i = this._timerTargets.length - 1; i >= 0; i--) {
				this._updateCountdown(this._timerTargets[i])
			}
		},
		_optionPlugin: function (a, b, c) {
			a = $(a);
			var d = a.data(this.propertyName);
			if (!b || (typeof b == 'string' && c == null)) {
				var e = b;
				b = (d || {}).options;
				return (b && e ? b[e] : b)
			}
			if (!a.hasClass(this.markerClassName)) {
				return
			}
			b = b || {};
			if (typeof b == 'string') {
				var e = b;
				b = {};
				b[e] = c
			}
			this._resetExtraLabels(d.options, b);
			var f = (d.options.timezone != b.timezone);
			$.extend(d.options, b);
			this._adjustSettings(a, d, b.until != null || b.since != null || f);
			var g = new Date();
			if ((d._since && d._since < g) || (d._until && d._until > g)) {
				this._addTarget(a[0])
			}
			this._updateCountdown(a, d)
		},
		_updateCountdown: function (a, b) {
			var c = $(a);
			b = b || c.data(this.propertyName);
			if (!b) {
				return
			}
			c.html(this._generateHTML(b)).toggleClass(this._rtlClass, b.options.isRTL);
			if ($.isFunction(b.options.onTick)) {
				var d = b._hold != 'lap' ? b._periods : this._calculatePeriods(b, b._show, b.options.significant, new Date());
				if (b.options.tickInterval == 1 || this.periodsToSeconds(d) % b.options.tickInterval == 0) {
					b.options.onTick.apply(a, [d])
				}
			}
			var e = b._hold != 'pause' && (b._since ? b._now.getTime() < b._since.getTime() : b._now.getTime() >= b._until.getTime());
			if (e && !b._expiring) {
				b._expiring = true;
				if (this._hasTarget(a) || b.options.alwaysExpire) {
					this._removeTarget(a);
					if ($.isFunction(b.options.onExpiry)) {
						b.options.onExpiry.apply(a, [])
					}
					if (b.options.expiryText) {
						var f = b.options.layout;
						b.options.layout = b.options.expiryText;
						this._updateCountdown(a, b);
						b.options.layout = f
					}
					if (b.options.expiryUrl) {
						window.location = b.options.expiryUrl
					}
				}
				b._expiring = false
			} else if (b._hold == 'pause') {
				this._removeTarget(a)
			}
			c.data(this.propertyName, b)
		},
		_resetExtraLabels: function (a, b) {
			var c = false;
			for (var n in b) {
				if (n != 'whichLabels' && n.match(/[Ll]abels/)) {
					c = true;
					break
				}
			}
			if (c) {
				for (var n in a) {
					if (n.match(/[Ll]abels[02-9]|compactLabels1/)) {
						a[n] = null
					}
				}
			}
		},
		_adjustSettings: function (a, b, c) {
			var d;
			var e = 0;
			var f = null;
			for (var i = 0; i < this._serverSyncs.length; i++) {
				if (this._serverSyncs[i][0] == b.options.serverSync) {
					f = this._serverSyncs[i][1];
					break
				}
			}
			if (f != null) {
				e = (b.options.serverSync ? f : 0);
				d = new Date()
			} else {
				var g = ($.isFunction(b.options.serverSync) ? b.options.serverSync.apply(a, []) : null);
				d = new Date();
				e = (g ? d.getTime() - g.getTime() : 0);
				this._serverSyncs.push([b.options.serverSync, e])
			}
			var h = b.options.timezone;
			h = (h == null ? -d.getTimezoneOffset() : h);
			if (c || (!c && b._until == null && b._since == null)) {
				b._since = b.options.since;
				if (b._since != null) {
					b._since = this.UTCDate(h, this._determineTime(b._since, null));
					if (b._since && e) {
						b._since.setMilliseconds(b._since.getMilliseconds() + e)
					}
				}
				b._until = this.UTCDate(h, this._determineTime(b.options.until, d));
				if (e) {
					b._until.setMilliseconds(b._until.getMilliseconds() + e)
				}
			}
			b._show = this._determineShow(b)
		},
		_destroyPlugin: function (a) {
			a = $(a);
			if (!a.hasClass(this.markerClassName)) {
				return
			}
			this._removeTarget(a[0]);
			a.removeClass(this.markerClassName).empty().removeData(this.propertyName)
		},
		_pausePlugin: function (a) {
			this._hold(a, 'pause')
		},
		_lapPlugin: function (a) {
			this._hold(a, 'lap')
		},
		_resumePlugin: function (a) {
			this._hold(a, null)
		},
		_hold: function (a, b) {
			var c = $.data(a, this.propertyName);
			if (c) {
				if (c._hold == 'pause' && !b) {
					c._periods = c._savePeriods;
					var d = (c._since ? '-' : '+');
					c[c._since ? '_since' : '_until'] = this._determineTime(d + c._periods[0] + 'y' + d + c._periods[1] + 'o' + d + c._periods[2] + 'w' + d + c._periods[3] + 'd' + d + c._periods[4] + 'h' + d + c._periods[5] + 'm' + d + c._periods[6] + 's');
					this._addTarget(a)
				}
				c._hold = b;
				c._savePeriods = (b == 'pause' ? c._periods : null);
				$.data(a, this.propertyName, c);
				this._updateCountdown(a, c)
			}
		},
		_getTimesPlugin: function (a) {
			var b = $.data(a, this.propertyName);
			return (!b ? null : (b._hold == 'pause' ? b._savePeriods : (!b._hold ? b._periods : this._calculatePeriods(b, b._show, b.options.significant, new Date()))))
		},
		_determineTime: function (k, l) {
			var m = function (a) {
				var b = new Date();
				b.setTime(b.getTime() + a * 1000);
				return b
			};
			var n = function (a) {
				a = a.toLowerCase();
				var b = new Date();
				var c = b.getFullYear();
				var d = b.getMonth();
				var e = b.getDate();
				var f = b.getHours();
				var g = b.getMinutes();
				var h = b.getSeconds();
				var i = /([+-]?[0-9]+)\s*(s|m|h|d|w|o|y)?/g;
				var j = i.exec(a);
				while (j) {
					switch (j[2] || 's') {
					case 's':
						h += parseInt(j[1], 10);
						break;
					case 'm':
						g += parseInt(j[1], 10);
						break;
					case 'h':
						f += parseInt(j[1], 10);
						break;
					case 'd':
						e += parseInt(j[1], 10);
						break;
					case 'w':
						e += parseInt(j[1], 10) * 7;
						break;
					case 'o':
						d += parseInt(j[1], 10);
						e = Math.min(e, x._getDaysInMonth(c, d));
						break;
					case 'y':
						c += parseInt(j[1], 10);
						e = Math.min(e, x._getDaysInMonth(c, d));
						break
					}
					j = i.exec(a)
				}
				return new Date(c, d, e, f, g, h, 0)
			};
			var o = (k == null ? l : (typeof k == 'string' ? n(k) : (typeof k == 'number' ? m(k) : k)));
			if (o) o.setMilliseconds(0);
			return o
		},
		_getDaysInMonth: function (a, b) {
			return 32 - new Date(a, b, 32).getDate()
		},
		_normalLabels: function (a) {
			return a
		},
		_generateHTML: function (c) {
			var d = this;
			c._periods = (c._hold ? c._periods : this._calculatePeriods(c, c._show, c.options.significant, new Date()));
			var e = false;
			var f = 0;
			var g = c.options.significant;
			var h = $.extend({}, c._show);
			for (var i = Y; i <= S; i++) {
				e |= (c._show[i] == '?' && c._periods[i] > 0);
				h[i] = (c._show[i] == '?' && !e ? null : c._show[i]);
				f += (h[i] ? 1 : 0);
				g -= (c._periods[i] > 0 ? 1 : 0)
			}
			var j = [false, false, false, false, false, false, false];
			for (var i = S; i >= Y; i--) {
				if (c._show[i]) {
					if (c._periods[i]) {
						j[i] = true
					} else {
						j[i] = g > 0;
						g--
					}
				}
			}
			var k = (c.options.compact ? c.options.compactLabels : c.options.labels);
			var l = c.options.whichLabels || this._normalLabels;
			var m = function (a) {
				var b = c.options['compactLabels' + l(c._periods[a])];
				return (h[a] ? d._translateDigits(c, c._periods[a]) + (b ? b[a] : k[a]) + ' ' : '')
			};
			var n = function (a) {
				var b = c.options['labels' + l(c._periods[a])];
				if (a !== 6) {
					return ((!c.options.significant && h[a]) || (c.options.significant && j[a]) ? '<span class="' + x._sectionClass + '">' + '<span class="' + x._amountClass + '">' + d._translateDigits(c, c._periods[a]) + '</span><br/>' + (b ? b[a] : k[a]) + '</span>' : '')
				} else {
					return '<span class="' + x._sectionClass + '">' + '<span class="' + x._amountClass + '">' + d._translateDigits(c, c._periods[a]) + '</span><br/>' + (b ? b[a] : k[a]) + '</span>';
				}
			};
			return (c.options.layout ? this._buildLayout(c, h, c.options.layout, c.options.compact, c.options.significant, j) : ((c.options.compact ? '<span class="' + this._rowClass + ' ' + this._amountClass + (c._hold ? ' ' + this._holdingClass : '') + '">' + m(Y) + m(O) + m(W) + m(D) + (h[H] ? this._minDigits(c, c._periods[H], 2) : '') + (h[M] ? (h[H] ? c.options.timeSeparator : '') + this._minDigits(c, c._periods[M], 2) : '') + (h[S] ? (h[H] || h[M] ? c.options.timeSeparator : '') + this._minDigits(c, c._periods[S], 2) : '') : '<span class="' + this._rowClass + ' ' + this._showClass + (c.options.significant || f) + (c._hold ? ' ' + this._holdingClass : '') + '">' + n(Y) + n(O) + n(W) + n(D) + n(H) + n(M) + n(S)) + '</span>' + (c.options.description ? '<span class="' + this._rowClass + ' ' + this._descrClass + '">' + c.options.description + '</span>' : '')))
		},
		_buildLayout: function (c, d, e, f, g, h) {
			var j = c.options[f ? 'compactLabels' : 'labels'];
			var k = c.options.whichLabels || this._normalLabels;
			var l = function (a) {
				return (c.options[(f ? 'compactLabels' : 'labels') + k(c._periods[a])] || j)[a]
			};
			var m = function (a, b) {
				return c.options.digits[Math.floor(a / b) % 10]
			};
			var o = {
				desc: c.options.description,
				sep: c.options.timeSeparator,
				yl: l(Y),
				yn: this._minDigits(c, c._periods[Y], 1),
				ynn: this._minDigits(c, c._periods[Y], 2),
				ynnn: this._minDigits(c, c._periods[Y], 3),
				y1: m(c._periods[Y], 1),
				y10: m(c._periods[Y], 10),
				y100: m(c._periods[Y], 100),
				y1000: m(c._periods[Y], 1000),
				ol: l(O),
				on: this._minDigits(c, c._periods[O], 1),
				onn: this._minDigits(c, c._periods[O], 2),
				onnn: this._minDigits(c, c._periods[O], 3),
				o1: m(c._periods[O], 1),
				o10: m(c._periods[O], 10),
				o100: m(c._periods[O], 100),
				o1000: m(c._periods[O], 1000),
				wl: l(W),
				wn: this._minDigits(c, c._periods[W], 1),
				wnn: this._minDigits(c, c._periods[W], 2),
				wnnn: this._minDigits(c, c._periods[W], 3),
				w1: m(c._periods[W], 1),
				w10: m(c._periods[W], 10),
				w100: m(c._periods[W], 100),
				w1000: m(c._periods[W], 1000),
				dl: l(D),
				dn: this._minDigits(c, c._periods[D], 1),
				dnn: this._minDigits(c, c._periods[D], 2),
				dnnn: this._minDigits(c, c._periods[D], 3),
				d1: m(c._periods[D], 1),
				d10: m(c._periods[D], 10),
				d100: m(c._periods[D], 100),
				d1000: m(c._periods[D], 1000),
				hl: l(H),
				hn: this._minDigits(c, c._periods[H], 1),
				hnn: this._minDigits(c, c._periods[H], 2),
				hnnn: this._minDigits(c, c._periods[H], 3),
				h1: m(c._periods[H], 1),
				h10: m(c._periods[H], 10),
				h100: m(c._periods[H], 100),
				h1000: m(c._periods[H], 1000),
				ml: l(M),
				mn: this._minDigits(c, c._periods[M], 1),
				mnn: this._minDigits(c, c._periods[M], 2),
				mnnn: this._minDigits(c, c._periods[M], 3),
				m1: m(c._periods[M], 1),
				m10: m(c._periods[M], 10),
				m100: m(c._periods[M], 100),
				m1000: m(c._periods[M], 1000),
				sl: l(S),
				sn: this._minDigits(c, c._periods[S], 1),
				snn: this._minDigits(c, c._periods[S], 2),
				snnn: this._minDigits(c, c._periods[S], 3),
				s1: m(c._periods[S], 1),
				s10: m(c._periods[S], 10),
				s100: m(c._periods[S], 100),
				s1000: m(c._periods[S], 1000)
			};
			var p = e;
			for (var i = Y; i <= S; i++) {
				var q = 'yowdhms'.charAt(i);
				var r = new RegExp('\\{' + q + '<\\}(.*)\\{' + q + '>\\}', 'g');
				p = p.replace(r, ((!g && d[i]) || (g && h[i]) ? '$1' : ''))
			}
			$.each(o, function (n, v) {
				var a = new RegExp('\\{' + n + '\\}', 'g');
				p = p.replace(a, v)
			});
			return p
		},
		_minDigits: function (a, b, c) {
			b = '' + b;
			if (b.length >= c) {
				return this._translateDigits(a, b)
			}
			b = '0000000000' + b;
			return this._translateDigits(a, b.substr(b.length - c))
		},
		_translateDigits: function (b, c) {
			return ('' + c).replace(/[0-9]/g, function (a) {
				return b.options.digits[a]
			})
		},
		_determineShow: function (a) {
			var b = a.options.format;
			var c = [];
			c[Y] = (b.match('y') ? '?' : (b.match('Y') ? '!' : null));
			c[O] = (b.match('o') ? '?' : (b.match('O') ? '!' : null));
			c[W] = (b.match('w') ? '?' : (b.match('W') ? '!' : null));
			c[D] = (b.match('d') ? '?' : (b.match('D') ? '!' : null));
			c[H] = (b.match('h') ? '?' : (b.match('H') ? '!' : null));
			c[M] = (b.match('m') ? '?' : (b.match('M') ? '!' : null));
			c[S] = (b.match('s') ? '?' : (b.match('S') ? '!' : null));
			return c
		},
		_calculatePeriods: function (c, d, e, f) {
			c._now = f;
			c._now.setMilliseconds(0);
			var g = new Date(c._now.getTime());
			if (c._since) {
				if (f.getTime() < c._since.getTime()) {
					c._now = f = g
				} else {
					f = c._since
				}
			} else {
				g.setTime(c._until.getTime());
				if (f.getTime() > c._until.getTime()) {
					c._now = f = g
				}
			}
			var h = [0, 0, 0, 0, 0, 0, 0];
			if (d[Y] || d[O]) {
				var i = x._getDaysInMonth(f.getFullYear(), f.getMonth());
				var j = x._getDaysInMonth(g.getFullYear(), g.getMonth());
				var k = (g.getDate() == f.getDate() || (g.getDate() >= Math.min(i, j) && f.getDate() >= Math.min(i, j)));
				var l = function (a) {
					return (a.getHours() * 60 + a.getMinutes()) * 60 + a.getSeconds()
				};
				var m = Math.max(0, (g.getFullYear() - f.getFullYear()) * 12 + g.getMonth() - f.getMonth() + ((g.getDate() < f.getDate() && !k) || (k && l(g) < l(f)) ? -1 : 0));
				h[Y] = (d[Y] ? Math.floor(m / 12) : 0);
				h[O] = (d[O] ? m - h[Y] * 12 : 0);
				f = new Date(f.getTime());
				var n = (f.getDate() == i);
				var o = x._getDaysInMonth(f.getFullYear() + h[Y], f.getMonth() + h[O]);
				if (f.getDate() > o) {
					f.setDate(o)
				}
				f.setFullYear(f.getFullYear() + h[Y]);
				f.setMonth(f.getMonth() + h[O]);
				if (n) {
					f.setDate(o)
				}
			}
			var p = Math.floor((g.getTime() - f.getTime()) / 1000);
			var q = function (a, b) {
				h[a] = (d[a] ? Math.floor(p / b) : 0);
				p -= h[a] * b
			};
			q(W, 604800);
			q(D, 86400);
			q(H, 3600);
			q(M, 60);
			q(S, 1);
			if (p > 0 && !c._since) {
				var r = [1, 12, 4.3482, 7, 24, 60, 60];
				var s = S;
				var t = 1;
				for (var u = S; u >= Y; u--) {
					if (d[u]) {
						if (h[s] >= t) {
							h[s] = 0;
							p = 1
						}
						if (p > 0) {
							h[u]++;
							p = 0;
							s = u;
							t = 1
						}
					}
					t *= r[u]
				}
			}
			if (e) {
				for (var u = Y; u <= S; u++) {
					if (e && h[u]) {
						e--
					} else if (!e) {
						h[u] = 0
					}
				}
			}
			return h
		}
	});
	var w = ['getTimes'];

	function isNotChained(a, b) {
		if (a == 'option' && (b.length == 0 || (b.length == 1 && typeof b[0] == 'string'))) {
			return true
		}
		return $.inArray(a, w) > -1
	}
	$.fn.countdown = function (a) {
		var b = Array.prototype.slice.call(arguments, 1);
		if (isNotChained(a, b)) {
			return x['_' + a + 'Plugin'].apply(x, [this[0]].concat(b))
		}
		return this.each(function () {
			if (typeof a == 'string') {
				if (!x['_' + a + 'Plugin']) {
					throw 'Unknown command: ' + a;
				}
				x['_' + a + 'Plugin'].apply(x, [this].concat(b))
			} else {
				x._attachPlugin(this, a || {})
			}
		})
	};

	var x = $.countdown = new Countdown()
}(opjq));;
/*! Stellar.js v0.6.2 | Copyright 2013, Mark Dalgleish | http://markdalgleish.com/projects/stellar.js | http://markdalgleish.mit-license.org */
(function(e,t,n,r){function d(t,n){this.element=t,this.options=e.extend({},s,n),this._defaults=s,this._name=i,this.init()}var i="stellar",s={scrollProperty:"scroll",positionProperty:"position",horizontalScrolling:!0,verticalScrolling:!0,horizontalOffset:0,verticalOffset:0,responsive:!1,parallaxBackgrounds:!0,parallaxElements:!0,hideDistantElements:!0,hideElement:function(e){e.hide()},showElement:function(e){e.show()}},o={scroll:{getLeft:function(e){return e.scrollLeft()},setLeft:function(e,t){e.scrollLeft(t)},getTop:function(e){return e.scrollTop()},setTop:function(e,t){e.scrollTop(t)}},position:{getLeft:function(e){return parseInt(e.css("left"),10)*-1},getTop:function(e){return parseInt(e.css("top"),10)*-1}},margin:{getLeft:function(e){return parseInt(e.css("margin-left"),10)*-1},getTop:function(e){return parseInt(e.css("margin-top"),10)*-1}},transform:{getLeft:function(e){var t=getComputedStyle(e[0])[f];return t!=="none"?parseInt(t.match(/(-?[0-9]+)/g)[4],10)*-1:0},getTop:function(e){var t=getComputedStyle(e[0])[f];return t!=="none"?parseInt(t.match(/(-?[0-9]+)/g)[5],10)*-1:0}}},u={position:{setLeft:function(e,t){e.css("left",t)},setTop:function(e,t){e.css("top",t)}},transform:{setPosition:function(e,t,n,r,i){e[0].style[f]="translate3d("+(t-n)+"px, "+(r-i)+"px, 0)"}}},a=function(){var t=/^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,n=e("script")[0].style,r="",i;for(i in n)if(t.test(i)){r=i.match(t)[0];break}return"WebkitOpacity"in n&&(r="Webkit"),"KhtmlOpacity"in n&&(r="Khtml"),function(e){return r+(r.length>0?e.charAt(0).toUpperCase()+e.slice(1):e)}}(),f=a("transform"),l=e("<div />",{style:"background:#fff"}).css("background-position-x")!==r,c=l?function(e,t,n){e.css({"background-position-x":t,"background-position-y":n})}:function(e,t,n){e.css("background-position",t+" "+n)},h=l?function(e){return[e.css("background-position-x"),e.css("background-position-y")]}:function(e){return e.css("background-position").split(" ")},p=t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||t.msRequestAnimationFrame||function(e){setTimeout(e,1e3/60)};d.prototype={init:function(){this.options.name=i+"_"+Math.floor(Math.random()*1e9),this._defineElements(),this._defineGetters(),this._defineSetters(),this._handleWindowLoadAndResize(),this._detectViewport(),this.refresh({firstLoad:!0}),this.options.scrollProperty==="scroll"?this._handleScrollEvent():this._startAnimationLoop()},_defineElements:function(){this.element===n.body&&(this.element=t),this.$scrollElement=e(this.element),this.$element=this.element===t?e("body"):this.$scrollElement,this.$viewportElement=this.options.viewportElement!==r?e(this.options.viewportElement):this.$scrollElement[0]===t||this.options.scrollProperty==="scroll"?this.$scrollElement:this.$scrollElement.parent()},_defineGetters:function(){var e=this,t=o[e.options.scrollProperty];this._getScrollLeft=function(){return t.getLeft(e.$scrollElement)},this._getScrollTop=function(){return t.getTop(e.$scrollElement)}},_defineSetters:function(){var t=this,n=o[t.options.scrollProperty],r=u[t.options.positionProperty],i=n.setLeft,s=n.setTop;this._setScrollLeft=typeof i=="function"?function(e){i(t.$scrollElement,e)}:e.noop,this._setScrollTop=typeof s=="function"?function(e){s(t.$scrollElement,e)}:e.noop,this._setPosition=r.setPosition||function(e,n,i,s,o){t.options.horizontalScrolling&&r.setLeft(e,n,i),t.options.verticalScrolling&&r.setTop(e,s,o)}},_handleWindowLoadAndResize:function(){var n=this,r=e(t);n.options.responsive&&r.bind("load."+this.name,function(){n.refresh()}),r.bind("resize."+this.name,function(){n._detectViewport(),n.options.responsive&&n.refresh()})},refresh:function(n){var r=this,i=r._getScrollLeft(),s=r._getScrollTop();(!n||!n.firstLoad)&&this._reset(),this._setScrollLeft(0),this._setScrollTop(0),this._setOffsets(),this._findParticles(),this._findBackgrounds(),n&&n.firstLoad&&/WebKit/.test(navigator.userAgent)&&e(t).load(function(){var e=r._getScrollLeft(),t=r._getScrollTop();r._setScrollLeft(e+1),r._setScrollTop(t+1),r._setScrollLeft(e),r._setScrollTop(t)}),this._setScrollLeft(i),this._setScrollTop(s)},_detectViewport:function(){var e=this.$viewportElement.offset(),t=e!==null&&e!==r;this.viewportWidth=this.$viewportElement.width(),this.viewportHeight=this.$viewportElement.height(),this.viewportOffsetTop=t?e.top:0,this.viewportOffsetLeft=t?e.left:0},_findParticles:function(){var t=this,n=this._getScrollLeft(),i=this._getScrollTop();if(this.particles!==r)for(var s=this.particles.length-1;s>=0;s--)this.particles[s].$element.data("stellar-elementIsActive",r);this.particles=[];if(!this.options.parallaxElements)return;this.$element.find("[data-stellar-ratio]").each(function(n){var i=e(this),s,o,u,a,f,l,c,h,p,d=0,v=0,m=0,g=0;if(!i.data("stellar-elementIsActive"))i.data("stellar-elementIsActive",this);else if(i.data("stellar-elementIsActive")!==this)return;t.options.showElement(i),i.data("stellar-startingLeft")?(i.css("left",i.data("stellar-startingLeft")),i.css("top",i.data("stellar-startingTop"))):(i.data("stellar-startingLeft",i.css("left")),i.data("stellar-startingTop",i.css("top"))),u=i.position().left,a=i.position().top,f=i.css("margin-left")==="auto"?0:parseInt(i.css("margin-left"),10),l=i.css("margin-top")==="auto"?0:parseInt(i.css("margin-top"),10),h=i.offset().left-f,p=i.offset().top-l,i.parents().each(function(){var t=e(this);if(t.data("stellar-offset-parent")===!0)return d=m,v=g,c=t,!1;m+=t.position().left,g+=t.position().top}),s=i.data("stellar-horizontal-offset")!==r?i.data("stellar-horizontal-offset"):c!==r&&c.data("stellar-horizontal-offset")!==r?c.data("stellar-horizontal-offset"):t.horizontalOffset,o=i.data("stellar-vertical-offset")!==r?i.data("stellar-vertical-offset"):c!==r&&c.data("stellar-vertical-offset")!==r?c.data("stellar-vertical-offset"):t.verticalOffset,t.particles.push({$element:i,$offsetParent:c,isFixed:i.css("position")==="fixed",horizontalOffset:s,verticalOffset:o,startingPositionLeft:u,startingPositionTop:a,startingOffsetLeft:h,startingOffsetTop:p,parentOffsetLeft:d,parentOffsetTop:v,stellarRatio:i.data("stellar-ratio")!==r?i.data("stellar-ratio"):1,width:i.outerWidth(!0),height:i.outerHeight(!0),isHidden:!1})})},_findBackgrounds:function(){var t=this,n=this._getScrollLeft(),i=this._getScrollTop(),s;this.backgrounds=[];if(!this.options.parallaxBackgrounds)return;s=this.$element.find("[data-stellar-background-ratio]"),this.$element.data("stellar-background-ratio")&&(s=s.add(this.$element)),s.each(function(){var s=e(this),o=h(s),u,a,f,l,p,d,v,m,g,y=0,b=0,w=0,E=0;if(!s.data("stellar-backgroundIsActive"))s.data("stellar-backgroundIsActive",this);else if(s.data("stellar-backgroundIsActive")!==this)return;s.data("stellar-backgroundStartingLeft")?c(s,s.data("stellar-backgroundStartingLeft"),s.data("stellar-backgroundStartingTop")):(s.data("stellar-backgroundStartingLeft",o[0]),s.data("stellar-backgroundStartingTop",o[1])),p=s.css("margin-left")==="auto"?0:parseInt(s.css("margin-left"),10),d=s.css("margin-top")==="auto"?0:parseInt(s.css("margin-top"),10),v=s.offset().left-p-n,m=s.offset().top-d-i,s.parents().each(function(){var t=e(this);if(t.data("stellar-offset-parent")===!0)return y=w,b=E,g=t,!1;w+=t.position().left,E+=t.position().top}),u=s.data("stellar-horizontal-offset")!==r?s.data("stellar-horizontal-offset"):g!==r&&g.data("stellar-horizontal-offset")!==r?g.data("stellar-horizontal-offset"):t.horizontalOffset,a=s.data("stellar-vertical-offset")!==r?s.data("stellar-vertical-offset"):g!==r&&g.data("stellar-vertical-offset")!==r?g.data("stellar-vertical-offset"):t.verticalOffset,t.backgrounds.push({$element:s,$offsetParent:g,isFixed:s.css("background-attachment")==="fixed",horizontalOffset:u,verticalOffset:a,startingValueLeft:o[0],startingValueTop:o[1],startingBackgroundPositionLeft:isNaN(parseInt(o[0],10))?0:parseInt(o[0],10),startingBackgroundPositionTop:isNaN(parseInt(o[1],10))?0:parseInt(o[1],10),startingPositionLeft:s.position().left,startingPositionTop:s.position().top,startingOffsetLeft:v,startingOffsetTop:m,parentOffsetLeft:y,parentOffsetTop:b,stellarRatio:s.data("stellar-background-ratio")===r?1:s.data("stellar-background-ratio")})})},_reset:function(){var e,t,n,r,i;for(i=this.particles.length-1;i>=0;i--)e=this.particles[i],t=e.$element.data("stellar-startingLeft"),n=e.$element.data("stellar-startingTop"),this._setPosition(e.$element,t,t,n,n),this.options.showElement(e.$element),e.$element.data("stellar-startingLeft",null).data("stellar-elementIsActive",null).data("stellar-backgroundIsActive",null);for(i=this.backgrounds.length-1;i>=0;i--)r=this.backgrounds[i],r.$element.data("stellar-backgroundStartingLeft",null).data("stellar-backgroundStartingTop",null),c(r.$element,r.startingValueLeft,r.startingValueTop)},destroy:function(){this._reset(),this.$scrollElement.unbind("resize."+this.name).unbind("scroll."+this.name),this._animationLoop=e.noop,e(t).unbind("load."+this.name).unbind("resize."+this.name)},_setOffsets:function(){var n=this,r=e(t);r.unbind("resize.horizontal-"+this.name).unbind("resize.vertical-"+this.name),typeof this.options.horizontalOffset=="function"?(this.horizontalOffset=this.options.horizontalOffset(),r.bind("resize.horizontal-"+this.name,function(){n.horizontalOffset=n.options.horizontalOffset()})):this.horizontalOffset=this.options.horizontalOffset,typeof this.options.verticalOffset=="function"?(this.verticalOffset=this.options.verticalOffset(),r.bind("resize.vertical-"+this.name,function(){n.verticalOffset=n.options.verticalOffset()})):this.verticalOffset=this.options.verticalOffset},_repositionElements:function(){var e=this._getScrollLeft(),t=this._getScrollTop(),n,r,i,s,o,u,a,f=!0,l=!0,h,p,d,v,m;if(this.currentScrollLeft===e&&this.currentScrollTop===t&&this.currentWidth===this.viewportWidth&&this.currentHeight===this.viewportHeight)return;this.currentScrollLeft=e,this.currentScrollTop=t,this.currentWidth=this.viewportWidth,this.currentHeight=this.viewportHeight;for(m=this.particles.length-1;m>=0;m--)i=this.particles[m],s=i.isFixed?1:0,this.options.horizontalScrolling?(h=(e+i.horizontalOffset+this.viewportOffsetLeft+i.startingPositionLeft-i.startingOffsetLeft+i.parentOffsetLeft)*-(i.stellarRatio+s-1)+i.startingPositionLeft,d=h-i.startingPositionLeft+i.startingOffsetLeft):(h=i.startingPositionLeft,d=i.startingOffsetLeft),this.options.verticalScrolling?(p=(t+i.verticalOffset+this.viewportOffsetTop+i.startingPositionTop-i.startingOffsetTop+i.parentOffsetTop)*-(i.stellarRatio+s-1)+i.startingPositionTop,v=p-i.startingPositionTop+i.startingOffsetTop):(p=i.startingPositionTop,v=i.startingOffsetTop),this.options.hideDistantElements&&(l=!this.options.horizontalScrolling||d+i.width>(i.isFixed?0:e)&&d<(i.isFixed?0:e)+this.viewportWidth+this.viewportOffsetLeft,f=!this.options.verticalScrolling||v+i.height>(i.isFixed?0:t)&&v<(i.isFixed?0:t)+this.viewportHeight+this.viewportOffsetTop),l&&f?(i.isHidden&&(this.options.showElement(i.$element),i.isHidden=!1),this._setPosition(i.$element,h,i.startingPositionLeft,p,i.startingPositionTop)):i.isHidden||(this.options.hideElement(i.$element),i.isHidden=!0);for(m=this.backgrounds.length-1;m>=0;m--)o=this.backgrounds[m],s=o.isFixed?0:1,u=this.options.horizontalScrolling?(e+o.horizontalOffset-this.viewportOffsetLeft-o.startingOffsetLeft+o.parentOffsetLeft-o.startingBackgroundPositionLeft)*(s-o.stellarRatio)+"px":o.startingValueLeft,a=this.options.verticalScrolling?(t+o.verticalOffset-this.viewportOffsetTop-o.startingOffsetTop+o.parentOffsetTop-o.startingBackgroundPositionTop)*(s-o.stellarRatio)+"px":o.startingValueTop,c(o.$element,u,a)},_handleScrollEvent:function(){var e=this,t=!1,n=function(){e._repositionElements(),t=!1},r=function(){t||(p(n),t=!0)};this.$scrollElement.bind("scroll."+this.name,r),r()},_startAnimationLoop:function(){var e=this;this._animationLoop=function(){p(e._animationLoop),e._repositionElements()},this._animationLoop()}},e.fn[i]=function(t){var n=arguments;if(t===r||typeof t=="object")return this.each(function(){e.data(this,"plugin_"+i)||e.data(this,"plugin_"+i,new d(this,t))});if(typeof t=="string"&&t[0]!=="_"&&t!=="init")return this.each(function(){var r=e.data(this,"plugin_"+i);r instanceof d&&typeof r[t]=="function"&&r[t].apply(r,Array.prototype.slice.call(n,1)),t==="destroy"&&e.data(this,"plugin_"+i,null)})},e[i]=function(n){var r=e(t);return r.stellar.apply(r,Array.prototype.slice.call(arguments,0))},e[i].scrollProperty=o,e[i].positionProperty=u,t.Stellar=d})(opjq,this,document);;
/*
 *
 *  Note: The only code that should go in this file is code that can and should be
 *  executed globally. This means not only the user facing pages but the admin as well
 *
 */

(function($){
    //Init obejcts
    var Assets = {},
        Sharrre = {};

    //Init Assets object
    Assets.init = {}; //Used to hold all assets init functions

    //Init Sharrre constants
    Sharrre.urlCurl = OptimizePress.paths.js + 'jquery/sharrre.inc.php';
    Sharrre.services = [
        'twitter',
        'facebook',
        'googlePlus',
        'linkedin'
    ];
    Sharrre.options = {
        enableHover: false,
        enableTracking: true,
        urlCurl: Sharrre.urlCurl,
        buttons: {
            twitter: {},
            facebook: {},
            googlePlus: {}
        }
    };

    //Init document ready
    $(document).ready(function(){
        //Init general
        init_sharrre();
        init_selectnav();
        init_dropkick();
        init_tooltipster();
        init_reveal();
        addTextAttributes();
        generate_row_decreasing_index_and_append_to_head();
        init_parallax();

        //Init assets
        if ('function' === typeof Assets.init.countdown){
            Assets.init.countdown();
        }
        if ('function' === typeof Assets.init.countdown_cookie){
            Assets.init.countdown_cookie();
        }
    });

    function addTextAttributes() {
        $('input').each(function(){
            if (!$(this).attr('type')) {
                $(this).attr('type', 'text');
            }
        });
    }

    /**
     * Generate internal CSS for decreasing .row z-index.
     * This is necessary to display section separators
     */
    function generate_row_decreasing_index_and_append_to_head() {
        var allSectionSeparatorStyles = $('style[id^="section-separator-style-"]');

        if(allSectionSeparatorStyles.length > 0) {
            var allRows = $('.row[id^="le_body_row_"]');
            var decreasingRowIndexStyle = '<style id="op-decreasing-row-zindex">'

            for (var i = 0; i < allRows.length; i++) {
                decreasingRowIndexStyle += '#le_body_row_' + (i + 1) + '{' +
                    'z-index: ' + (parseInt(50) - parseInt((i + 1))) + ';' +
                    '}'
            }

            decreasingRowIndexStyle += '</style>';
            $('head').append(decreasingRowIndexStyle);
        }
    }

    /**
     * Function will call .stellar() against window if there is any row with class bg-parallax
     * TODO: after new iOS release check if blurry background images still exists
     */
    function init_parallax(){
        $(window).on("load", function(){
            if ($('.row').is('[class*="bg-parallax"]') && !isMobile.any()) {
                $.stellar({horizontalScrolling:false});
            }
            //iOS has an issue preventing background-position: fixed
            //from being used with background-size: cover
            //so we disable one statement to avoid
            //blurry images on iPhones etc.
            if (isMobile.iOS()) {
                var rows = $('.row[class*="bg-parallax"]');
                for (var i=0; i<rows.length; i++) {
                    $(rows[i]).css({backgroundAttachment: ""});
                }
            }
        });
        $(window).on("resize", function () {
            if ($('.row').is('[class*="bg-parallax"]') && !isMobile.any()) {
                $.stellar("refresh");
            }
        });
    }

    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };


    //Init the Sharrre widget functionality
    function init_sharrre(){
        $.each(Sharrre.services, function(index, val){
            var localOptions = Sharrre.options;

            //Set the click functionality
            localOptions.click = function(api, options){
                api.simulateClick();
                api.openPopup(val);
            }

            //Init share widgets
            $('.social-sharing .' + val).each(function(){
                //Get the language for this element
                var lang = (typeof($(this).data('lang'))=='undefined' ? 'en_US' : $(this).data('lang'));
                var via = (typeof($(this).data('via'))=='undefined' ? '' : $(this).data('via'));
                var title = (typeof($(this).data('title'))=='undefined' ? '' : $(this).data('title'));
                var url = (typeof($(this).data('url'))=='undefined' ? '' : $(this).data('url'));
                var likes = (typeof($(this).data('likes'))=='undefined' ? '' : $(this).data('likes'));

                //Enable/disable counter
                localOptions.enableCounter = $(this).parent().data('counter');

                //Set social variables
                switch(val){
                    case 'twitter':
                        localOptions.share = { twitter: true };
                        localOptions.buttons.twitter.lang = lang;
                        localOptions.buttons.twitter.via = via;
                        localOptions.buttons.twitter.title = title;
                        localOptions.buttons.twitter.url = url;
                        localOptions.buttons.twitter.likes = likes;
                        break;
                    case 'facebook':
                        localOptions.share = { facebook: true };
                        localOptions.buttons.facebook.lang = lang;
                        localOptions.buttons.facebook.likes = likes;
                        break;
                    case 'googlePlus':
                        localOptions.share = { googlePlus: true };
                        localOptions.buttons.googlePlus.lang = lang;
                        break;
                }

                //Apply sharrre to element
                $(this).sharrre(localOptions);
            });
        });
    }

    $(window).on('op_init_sharrre', init_sharrre);

    function init_selectnav(){
        if (typeof selectnav !== 'undefined') {
            selectnav('navigation-above', {indent: '<span>-</span>'});
            selectnav('navigation-below', {indent: '<span>-</span>'});
            selectnav('navigation-alongside', {indent: '<span>-</span>'});
        }
    }

    //Init the dropkick JS functionality
    function init_dropkick(){
        var navSelector = '.navigation .dk';
        var otherSelector = ($('body').hasClass('blog') ? '.main-content .dk' : '.content .dk');

        dropkickListener = function () {
            if (parseInt($(this).width(), 10) < 960) {
                $(navSelector).each(function () {
                    if (!$(this).data('dropkickInitialized')) {
                        $(this).dropkick({
                            mobile: true,
                            change: function () {
                                if (this.value) {
                                    window.location = this.value;
                                }
                            }
                        });
                        $(this).data('dropkickInitialized', 'true')
                    }

                    var item = $(this).siblings('ul').find('li:first-child a');
                    var color = item.css('color');
                    $(this).prev('.dk_container').find('.dk_label').css({ color: color });
                });
            }
        }

        //Init the nav dropkick functionality and trigger it
        $(window).on('resize', dropkickListener).trigger('resize');

        //Init the other content dropkick dropdowns
        $(otherSelector).each(function(){
            if (!$(this).data('dropkickInitialized')) {
                $(this).dropkick({
                    mobile: true,
                    change: function () {
                        if (value) {
                            window.location = value;
                        }
                    }
                });
                $(this).data('dropkickInitialized', 'true')
            }
        });

        $('li.op-pagebuilder a').fancybox({
            width: '98%',
            height: '98%',
            padding: 0,
            scrolling: 'no',
            closeClick: false,
            type: 'iframe',
            openEffect: 'none',
            closeEffect: 'fade',
            openSpeed: 0,
            closeSpeed: 200,
            openOpacity: true,
            closeOpacity: true,
            scrollOutside: false,
            helpers: {
                overlay: {
                    closeClick: false,
                    showEarly: false,
                    css: { opacity: 0 },
                    speedOut: 200,
                    locked: false
                }
            },
            beforeLoad: function () {
                op_show_loading();
            },
            beforeShow: function() {
                OptimizePress.fancyboxBeforeShowAnimation(this);
            },
            afterShow: function () {
                op_hide_loading();
                $('.fancybox-opened').find('iframe').focus();
            },
            beforeClose: function(){
                var returnValue = false;

                if (!OptimizePress.disable_alert) {
                    returnValue = confirm(OptimizePress.pb_unload_alert);
                    if (returnValue) {
                        OptimizePress.fancyboxBeforeCloseAnimation(this);
                    }
                    return returnValue;
                }

                OptimizePress.fancyboxBeforeCloseAnimation(this);
                OptimizePress.disable_alert = false;
            }
        });
    }

    function init_tooltipster(){
        $('.tooltip').tooltipster({animation: 'grow'});
    }

    function init_reveal(){
        $('.optin-modal-container').each(function(){
            $(this).on('click', '.optin-modal-link', function(e) {
                e.preventDefault();
                $(this).next('.optin-modal').reveal();
            });
            $(this).on('click', ' .optin-modal .css-button', function(e){
                e.preventDefault();
                $(this).parent('form').submit();
            });
        });
    }

    //Countdown Asset
    Assets.init.countdown = function(){

        // We want to initialize countdown timers
        // on blog posts in WYSIWYG too
        // (but we don't want them
        // to be counting, so we
        // just pause them)
        var $tinymceIframes = $('.mce-tinymce iframe');
        var $tinymceIframeTimers;
        if ($tinymceIframes.length > 0) {
            $iframeTimers = $tinymceIframes.contents().find('div.countdown-timer');
            $iframeTimers.each(eachCountdownTimer);
            $iframeTimers.countdown('pause');
        }

        // Initialize countdown timers
        // on the current page.
        $('div.countdown-timer').each(eachCountdownTimer);

        function eachCountdownTimer() {

            //Extract date and time
            var obj = $(this),
                data = obj.data('end').split(' '),
                date = (typeof(data[0])=='undefined' ? '00/00/0000' : data[0].split('/')),
                time = (typeof(data[1])=='undefined' ? '00:00:00' : data[1].split(':')),
                isSince = (typeof(obj.data('end'))!='undefined' ? false : true),
                newDateObj = new Date(date[0], parseInt(date[1])-1, date[2], time[0], time[1], time[2]),
                labels = [
                    obj.data('years_text')   === undefined ? 'Years'   : obj.data('years_text'),
                    obj.data('months_text')  === undefined ? 'Months'  : obj.data('months_text'),
                    obj.data('weeks_text')   === undefined ? 'Weeks'   : obj.data('weeks_text'),
                    obj.data('days_text')    === undefined ? 'Days'    : obj.data('days_text'),
                    obj.data('hours_text')   === undefined ? 'Hours'   : obj.data('hours_text'),
                    obj.data('minutes_text') === undefined ? 'Minutes' : obj.data('minutes_text'),
                    obj.data('seconds_text') === undefined ? 'Seconds' : obj.data('seconds_text')
                ],
                labels1 = [
                    obj.data('years_text_singular')   === undefined ? 'Year'   : obj.data('years_text_singular'),
                    obj.data('months_text_singular')  === undefined ? 'Month'  : obj.data('months_text_singular'),
                    obj.data('weeks_text_singular')   === undefined ? 'Week'   : obj.data('weeks_text_singular'),
                    obj.data('days_text_singular')    === undefined ? 'Day'    : obj.data('days_text_singular'),
                    obj.data('hours_text_singular')   === undefined ? 'Hour'   : obj.data('hours_text_singular'),
                    obj.data('minutes_text_singular') === undefined ? 'Minute' : obj.data('minutes_text_singular'),
                    obj.data('seconds_text_singular') === undefined ? 'Second' : obj.data('seconds_text_singular')
                ],
                format = obj.data('format') || 'yodhms',
                width = 0,
                widthOffset = 9;

            for (var i = 0; i < labels.length; i++) {
                if (labels[i].replace(/\s+/g, '') == '') {
                    labels[i] = '&nbsp;';
                }
            }

            for (var i = 0; i < labels1.length; i++) {
                if (labels1[i].replace(/\s+/g, '') == '') {
                    labels1[i] = '&nbsp;';
                }
            }

            var initCountdown = function () {
                // Get redirect url and trim it (do not allow ' ')
                var redirect_url = $(obj).attr('data-redirect_url');
                redirect_url = redirect_url ? $.trim(redirect_url) : redirect_url;

                // Change location?
                var expire = ! window.OptimizePress.wp_admin_page && !! redirect_url;

                //Init countdown
                obj.countdown({
                    until: newDateObj,
                    format: 'yodhms',
                    labels: labels,
                    labels1: labels1,
                    format: format,
                    'timezone': data[data.length-1],
                    expiryUrl: expire ? redirect_url : '',
                    alwaysExpire: expire
                });

                //Get countdown sections and add each width to width variable
                obj.find('span.countdown_section').each(function(){
                    width += $(this).width() + widthOffset;
                });

                //Set width to main obj
                //obj.width(width + 'px');
                obj.width('100%');
            }

            // Download the script if it isn't loaded
            // and initiate countdown, and if script
            // is already loaded we just initialize
            // the elements again
            if (typeof $.countdown === 'undefined') {
                $.getScript(OptimizePress.paths.js + 'jquery/countdown' + OptimizePress.script_debug + '.js' + '?ver=' + OptimizePress.version, initCountdown);
            } else {
                initCountdown();
            }
        }
    }

    // Expose this script for when it's needed
    OptimizePress.initCountdownElements = Assets.init.countdown;

    //Countdown Cookie Asset
    Assets.init.countdown_cookie = function(){
        //Find each timer instance
        $('div.countdown-cookie-timer').each(function(){
            //Extract date and time
            var obj = $(this),
                data = obj.data('end').split(' '),
                date = (typeof(data[0])=='undefined' ? '00/00/0000' : data[0].split('/')),
                time = (typeof(data[1])=='undefined' ? '00:00:00' : data[1].split(':')),
                newDateObj = new Date(date[0], parseInt(date[1])-1, date[2], time[0], time[1], time[2]),
                labels = ['Years', 'Months', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'],
                labels1 = ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minute', 'Second'],
                width = 0,
                widthOffset = 9;

            //Download the script if it isn't loaded and initiate countdown
            $.getScript(OptimizePress.paths.js + 'jquery/countdown' + OptimizePress.script_debug + '.js' + '?ver=' + OptimizePress.version, function(){
                    //Init countdown
                    obj.countdown({
                        until: newDateObj,
                        format: 'yodhms',
                        labels: labels,
                        labels1: labels1
                    });

                    //Get countdown sections and add each width to width variable
                    obj.find('span.countdown_section, span.countdown_row').each(function(){
                        width += $(this).width() + widthOffset;
                    });

                    //Set width to main obj
                    obj.width(width + 'px');
            });
        });
    }


    // Easy cookie manipulation
    OptimizePress.cookie = {};

    OptimizePress.cookie.create = function (name, value, days) {
        var date;
        var expires;

        if (days) {
            date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }

        document.cookie = name + "=" + value + expires + "; path=/";
    };

    OptimizePress.cookie.read = function (name) {
        var nameEQ = name + "=";
        var cookiesArray = document.cookie.split(';');
        var cookiesArrayLength = cookiesArray.length;
        var i = 0;
        var cookie;

        for (i = 0; i < cookiesArrayLength; i += 1) {
            cookie = cookiesArray[i];

            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1, cookie.length);
            }

            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;
    };

    OptimizePress.cookie.erase = function (name) {
        OptimizePress.cookie.create(name, "", -1);
    };

})(opjq);
