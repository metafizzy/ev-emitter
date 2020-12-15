/**
 * EvEmitter v2.0.0
 * Lil' event emitter
 * MIT License
 */

( function( global, factory ) {
  // universal module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory();
  } else {
    // Browser globals
    global.EvEmitter = factory();
  }

}( typeof window != 'undefined' ? window : this, function() {

class EvEmitter {

  on( eventName, listener ) {
    if ( !eventName || !listener ) return this;

    // set events hash
    let events = this._events = this._events || {};
    // set listeners array
    let listeners = events[ eventName ] = events[ eventName ] || [];
    // only add once
    if ( !listeners.includes( listener ) ) {
      listeners.push( listener );
    }

    return this;
  }

  once( eventName, listener ) {
    if ( !eventName || !listener ) return this;

    // add event
    this.on( eventName, listener );
    // set once flag
    // set onceEvents hash
    let onceEvents = this._onceEvents = this._onceEvents || {};
    // set onceListeners object
    let onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
    // set flag
    onceListeners[ listener ] = true;

    return this;
  }

  off( eventName, listener ) {
    let listeners = this._events && this._events[ eventName ];
    if ( !listeners || !listeners.length ) return this;

    let index = listeners.indexOf( listener );
    if ( index != -1 ) {
      listeners.splice( index, 1 );
    }

    return this;
  }

  emitEvent( eventName, args ) {
    let listeners = this._events && this._events[ eventName ];
    if ( !listeners || !listeners.length ) return this;

    // copy over to avoid interference if .off() in listener
    listeners = listeners.slice( 0 );
    args = args || [];
    // once stuff
    let onceListeners = this._onceEvents && this._onceEvents[ eventName ];

    for ( let listener of listeners ) {
      let isOnce = onceListeners && onceListeners[ listener ];
      if ( isOnce ) {
        // remove listener
        // remove before trigger to prevent recursion
        this.off( eventName, listener );
        // unset once flag
        delete onceListeners[ listener ];
      }
      // trigger listener
      listener.apply( this, args );
    }

    return this;
  }

  allOff() {
    delete this._events;
    delete this._onceEvents;
    return this;
  }

}

return EvEmitter;

} ) );
