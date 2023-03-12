window.state = new device.state({
    pos: 0, state: 'paused', 
    color: 0, c_order:[],
});

/*--──────────────────────────────────────────────────────────────────────--*/

function randomColor(){ return Math.floor((Math.random()*4)+1) }

function showColor( i=0 ){
    const { c_order, color, state, pos } = window.state.state;
    if( state != 'playing' ) return 0; 
    
    if( color )
        return setTimeout(()=>{ window.state.set({ color:0 }); showColor(i) },200);

    if( c_order.length == i ) return window.state.set({ state: 'keyboard' });

    setTimeout(()=>{ window.state.set({ color:c_order[i] }); showColor(i+1) },500);
}

/*--──────────────────────────────────────────────────────────────────────--*/

window.state.observeField('pos',(prev,act)=>{ 
    const { c_order, color, state, pos } = window.state.state;
    if( state != 'keyboard' ) return 0;
    if( c_order[act-1] != color ) window.state.set({state: 'reset'});
    if( color )
        setTimeout(()=>{ window.state.set({ color:0 }) },200);
    if( pos >= c_order.length ) window.state.set(state=>({
        state: 'playing', color: 0, pos: 0,
        c_order: [ ...state.c_order, randomColor() ],
    }));
});

/*--──────────────────────────────────────────────────────────────────────--*/

window.state.observeField('c_order',(prev,act)=>{
    const { c_order, color, state, pos } = window.state.state;
    if( state != 'playing' ) return 0; 
    if( !act.length ) return window.state.set(state=>({
        c_order: [...state.c_order,randomColor()]
    })); showColor();
});

/*--──────────────────────────────────────────────────────────────────────--*/

window.state.observeField('state',(prev,act)=>{
    switch( act ){
        case 'playing': return window.state.set({ color: 0, pos: 0 });
        case 'paused':  return window.state.set({ color: 0, pos: 0 });
        case 'reset':   return window.state.set({ state: 'playing', c_order: [randomColor()] });
    }
});

/*--──────────────────────────────────────────────────────────────────────--*/
