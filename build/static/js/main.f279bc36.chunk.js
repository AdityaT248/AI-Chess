(this["webpackJsonpai-chess"]=this["webpackJsonpai-chess"]||[]).push([[0],[,,,,,,,,function(e,t,o){},function(e,t,o){},function(e,t,o){},,function(e,t,o){},function(e,t,o){},function(e,t,o){},function(e,t,o){"use strict";o.r(t);var c=o(1),a=o.n(c),s=o(3),r=o.n(s),i=(o(8),o(9),o(10),o.p+"static/media/white-pawn.236f6686.svg"),l=o.p+"static/media/white-rook.51da5ea4.svg",n=o.p+"static/media/white-knight.6682d263.svg",h=o.p+"static/media/white-bishop.434cf6df.svg",b=o.p+"static/media/white-queen.2ec74f60.svg",u=o.p+"static/media/white-king.5933a366.svg",d=o.p+"static/media/black-pawn.3df4af41.svg",m=o.p+"static/media/black-rook.6208da08.svg",g=o.p+"static/media/black-knight.dbe602a6.svg",j=o.p+"static/media/black-bishop.d3b59849.svg",p=o.p+"static/media/black-queen.81d53079.svg",f=o.p+"static/media/black-king.5c3d9d02.svg",k=o(0);const w={white:{pawn:i,rook:l,knight:n,bishop:h,queen:b,king:u},black:{pawn:d,rook:m,knight:g,bishop:j,queen:p,king:f}},O=Object(c.memo)((e=>{let{row:t,col:o,piece:c,isLight:a,isSelected:s,isHighlighted:r,isCheck:i,isLastMove:l,isHint:n,squareColor:h,onClick:b}=e,u="square "+(a?"light":"dark");s&&(u+=" selected"),r&&(u+=" highlighted"),i&&(u+=" check"),l&&(u+=" last-move"),n&&(u+=" hint");const d={backgroundColor:h};return Object(k.jsx)("div",{className:u,style:d,onClick:b,children:c&&!c.captured&&Object(k.jsx)("img",{src:w[c.color][c.type],alt:`${c.color} ${c.type}`,className:`piece ${c.color}`})})})),v=Object(c.memo)((()=>Object(k.jsxs)("div",{className:"board-coordinates",children:[Object(k.jsx)("div",{className:"files",children:["a","b","c","d","e","f","g","h"].map((e=>Object(k.jsx)("div",{children:e},e)))}),Object(k.jsx)("div",{className:"ranks",children:["8","7","6","5","4","3","2","1"].map((e=>Object(k.jsx)("div",{children:e},e)))})]}))),C=Object(c.memo)((e=>{let{capturedPieces:t,color:o}=e;const c="white"===o?t.black:t.white;return 0===c.length?null:Object(k.jsx)("div",{className:"captured-row",children:c.map(((e,t)=>Object(k.jsx)("img",{src:w[e.color][e.type],alt:`${e.color} ${e.type}`,className:"captured-piece"},t)))})})),y=e=>{let{board:t,selectedPiece:o,onSquareClick:a,highlightedSquares:s,checkIndicator:r,lastMove:i,hintMove:l,theme:n}=e;const h=Object(c.useMemo)((()=>{const e={white:[],black:[]};return t.flat().forEach((t=>{t&&t.captured&&e[t.color].push(t)})),e}),[t]),b=Object(c.useMemo)((()=>{const e={};return s.forEach((t=>{e[`${t.row}-${t.col}`]=!0})),e}),[s]),u=Object(c.useMemo)((()=>{if(!i)return{};const{from:e,to:t}=i;return{[`${e.row}-${e.col}`]:!0,[`${t.row}-${t.col}`]:!0}}),[i]),d=Object(c.useMemo)((()=>{if(!l)return{};const{fromRow:e,fromCol:t,toRow:o,toCol:c}=l;return{[`${e}-${t}`]:!0,[`${o}-${c}`]:!0}}),[l]),m=Object(c.useMemo)((()=>{const e=[],c=(e,t)=>!!b[`${e}-${t}`],s=(e,t)=>!!u[`${e}-${t}`],i=(e,t)=>!!d[`${e}-${t}`];for(let l=0;l<8;l++)for(let h=0;h<8;h++){const b=t[l][h],u=(l+h)%2===0,d=o&&o.row===l&&o.col===h,m=r&&b&&"king"===b.type&&b.color===r;e.push(Object(k.jsx)(O,{row:l,col:h,piece:b,isLight:u,isSelected:d,isHighlighted:c(l,h),isCheck:m,isLastMove:s(l,h),isHint:i(l,h),squareColor:u?n.lightSquare:n.darkSquare,onClick:()=>a(l,h)},`${l}-${h}`))}return e}),[t,o,r,n,a,b,u,d]),g=Object(c.useMemo)((()=>({background:n.boardBg,"--highlight-color":n.highlightColor,"--check-color":n.checkColor,"--last-move-color":n.lastMoveColor,"--accent-color":n.accentColor})),[n]);return Object(k.jsxs)("div",{className:"chess-board-container",style:g,children:[Object(k.jsx)("div",{className:"chess-board",children:m}),Object(k.jsx)(v,{}),Object(k.jsxs)("div",{className:"captured-pieces",children:[Object(k.jsx)(C,{capturedPieces:h,color:"white"}),Object(k.jsx)(C,{capturedPieces:h,color:"black"})]})]})};var x=Object(c.memo)(y);o(12);var N=e=>{let{playerTurn:t,gameStatus:o,moveHistory:a,onResetGame:s,isInCheck:r,aiDifficulty:i,onGetHint:l,aiThinking:n}=e;const[h,b]=Object(c.useState)("moves"),u=[];for(let c=0;c<a.length;c+=2)u.push({number:Math.floor(c/2)+1,white:a[c],black:a[c+1]});const d=(()=>{const e={pawn:1,knight:3,bishop:3,rook:5,queen:9,king:0};let t=0,o=0;a.forEach((c=>{c.capturedPiece&&("white"===c.capturedPiece.color?o+=e[c.capturedPiece.type]:t+=e[c.capturedPiece.type])}));const c=t-o;return c>0?{color:"white",value:c}:c<0?{color:"black",value:Math.abs(c)}:{color:"equal",value:0}})();return Object(k.jsxs)("div",{className:"game-info",children:[Object(k.jsx)("h2",{children:"Game Status"}),(()=>{let e="";return e="ongoing"===o?("white"===t?"White":"Black")+"'s turn":o.includes("checkmate")?o:o.includes("stalemate")?"Draw by stalemate":o,Object(k.jsxs)("div",{className:"status-container",children:[Object(k.jsxs)("div",{className:"status",children:[e,n&&"black"===t&&Object(k.jsxs)("div",{className:"ai-thinking",children:[Object(k.jsx)("span",{children:"AI is thinking"}),Object(k.jsxs)("div",{className:"thinking-dots",children:[Object(k.jsx)("span",{className:"dot"}),Object(k.jsx)("span",{className:"dot"}),Object(k.jsx)("span",{className:"dot"})]})]})]}),Object(k.jsxs)("div",{className:"player-indicators",children:[Object(k.jsx)("div",{className:"player-indicator "+("white"===t?"active":""),children:Object(k.jsx)("span",{className:"white",children:"White"})}),Object(k.jsx)("div",{className:"player-indicator "+("black"===t?"active":""),children:Object(k.jsx)("span",{className:"black",children:"Black"})})]}),r&&"ongoing"===o&&Object(k.jsxs)("div",{className:"check-status",children:["white"===t?"White":"Black"," is in check!"]}),"ongoing"!==o&&Object(k.jsx)("div",{className:"game-over",children:o}),Object(k.jsxs)("div",{className:"button-container",children:[Object(k.jsx)("button",{className:"reset-button",onClick:s,children:"New Game"}),Object(k.jsx)("button",{className:"hint-button",onClick:l,disabled:"ongoing"!==o||"white"!==t||n,children:"Hint"})]})]})})(),Object(k.jsxs)("div",{className:"tabs",children:[Object(k.jsx)("div",{className:"tab "+("moves"===h?"active":""),onClick:()=>b("moves"),children:"Moves"}),Object(k.jsx)("div",{className:"tab "+("analysis"===h?"active":""),onClick:()=>b("analysis"),children:"Analysis"})]}),Object(k.jsx)("div",{className:"tab-content",children:"moves"===h?0===a.length?Object(k.jsx)("div",{className:"no-moves",children:"No moves yet"}):Object(k.jsx)("div",{className:"moves-container",children:Object(k.jsxs)("table",{className:"moves-table",children:[Object(k.jsx)("thead",{children:Object(k.jsxs)("tr",{children:[Object(k.jsx)("th",{children:"#"}),Object(k.jsx)("th",{children:"White"}),Object(k.jsx)("th",{children:"Black"})]})}),Object(k.jsx)("tbody",{children:u.map((e=>Object(k.jsxs)("tr",{children:[Object(k.jsx)("td",{className:"move-number",children:e.number}),Object(k.jsx)("td",{className:"white-move",children:e.white?e.white.notation:""}),Object(k.jsx)("td",{className:"black-move",children:e.black?e.black.notation:""})]},e.number)))})]})}):(()=>{const e={easy:1,medium:2,hard:3}[i];return Object(k.jsxs)("div",{className:"analysis-container",children:[Object(k.jsxs)("div",{className:"analysis-item",children:[Object(k.jsx)("span",{className:"analysis-label",children:"Total Moves"}),Object(k.jsx)("span",{className:"analysis-value",children:a.length})]}),Object(k.jsxs)("div",{className:"analysis-item",children:[Object(k.jsx)("span",{className:"analysis-label",children:"Material Advantage"}),Object(k.jsx)("span",{className:`analysis-value material-advantage ${d.color}`,children:"equal"===d.color?"Equal":`+${d.value} for ${d.color}`})]}),Object(k.jsxs)("div",{className:"analysis-item",children:[Object(k.jsx)("span",{className:"analysis-label",children:"AI Thinking Depth"}),Object(k.jsxs)("span",{className:"analysis-value",children:[e," ",1===e?"move":"moves"]})]})]})})()})]})};o(13);var M=e=>{let{position:t,color:o,onSelect:c,onCancel:a}=e;const s={white:{queen:b,rook:l,bishop:h,knight:n},black:{queen:p,rook:m,bishop:j,knight:g}};return Object(k.jsx)("div",{className:"promotion-dialog-backdrop",onClick:a,children:Object(k.jsxs)("div",{className:"promotion-dialog",style:{top:t.y,left:t.x},onClick:e=>e.stopPropagation(),children:[Object(k.jsx)("div",{className:"promotion-title",children:"Promote to:"}),Object(k.jsx)("div",{className:"promotion-options",children:["queen","rook","bishop","knight"].map((e=>Object(k.jsxs)("div",{className:"promotion-piece",onClick:()=>c(e),children:[Object(k.jsx)("img",{src:s[o][e],alt:`${o} ${e}`,className:"promotion-piece-image"}),Object(k.jsx)("div",{className:"promotion-piece-name",children:e})]},e)))})]})})};o(14);var S={classic:{name:"Classic",lightSquare:"#f0d9b5",darkSquare:"#b58863",highlightColor:"rgba(78, 205, 196, 0.7)",checkColor:"rgba(255, 107, 107, 0.6)",lastMoveColor:"rgba(255, 209, 102, 0.4)",boardBg:"linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))",accentColor:"#4ecdc4"},blue:{name:"Ocean Blue",lightSquare:"#dee3e6",darkSquare:"#8ca2ad",highlightColor:"rgba(106, 168, 79, 0.7)",checkColor:"rgba(244, 67, 54, 0.6)",lastMoveColor:"rgba(255, 193, 7, 0.4)",boardBg:"linear-gradient(135deg, rgba(25, 118, 210, 0.9), rgba(13, 71, 161, 0.9))",accentColor:"#03a9f4"},dark:{name:"Midnight",lightSquare:"#6b7987",darkSquare:"#2e3947",highlightColor:"rgba(121, 134, 203, 0.7)",checkColor:"rgba(255, 82, 82, 0.6)",lastMoveColor:"rgba(255, 215, 64, 0.4)",boardBg:"linear-gradient(135deg, rgba(20, 20, 31, 0.9), rgba(10, 10, 18, 0.9))",accentColor:"#9c27b0"},green:{name:"Forest",lightSquare:"#eeeed2",darkSquare:"#769656",highlightColor:"rgba(119, 149, 86, 0.7)",checkColor:"rgba(255, 97, 97, 0.6)",lastMoveColor:"rgba(255, 213, 79, 0.4)",boardBg:"linear-gradient(135deg, rgba(27, 94, 32, 0.9), rgba(46, 125, 50, 0.9))",accentColor:"#8bc34a"},coral:{name:"Coral",lightSquare:"#fce4ec",darkSquare:"#f06292",highlightColor:"rgba(128, 203, 196, 0.7)",checkColor:"rgba(255, 82, 82, 0.6)",lastMoveColor:"rgba(255, 202, 40, 0.4)",boardBg:"linear-gradient(135deg, rgba(216, 27, 96, 0.9), rgba(142, 36, 170, 0.9))",accentColor:"#00bcd4"}};var q=e=>{let{currentTheme:t,onThemeChange:o}=e;return Object(k.jsxs)("div",{className:"theme-selector",children:[Object(k.jsx)("div",{className:"theme-selector-label",children:"Board Theme:"}),Object(k.jsx)("div",{className:"theme-options",children:Object.keys(S).map((e=>Object(k.jsxs)("div",{className:"theme-option "+(t===e?"active":""),onClick:()=>o(e),title:S[e].name,children:[Object(k.jsx)("div",{className:"theme-preview",style:{background:`linear-gradient(135deg, \n                  ${S[e].lightSquare} 0%, \n                  ${S[e].lightSquare} 50%, \n                  ${S[e].darkSquare} 50%, \n                  ${S[e].darkSquare} 100%)`}}),Object(k.jsx)("span",{className:"theme-name",children:S[e].name})]},e)))})]})};const R=()=>{const e=Array(8).fill().map((()=>Array(8).fill(null)));for(let t=0;t<8;t++)e[1][t]={type:"pawn",color:"black",hasMoved:!1},e[6][t]={type:"pawn",color:"white",hasMoved:!1};return e[0][0]={type:"rook",color:"black",hasMoved:!1},e[0][7]={type:"rook",color:"black",hasMoved:!1},e[7][0]={type:"rook",color:"white",hasMoved:!1},e[7][7]={type:"rook",color:"white",hasMoved:!1},e[0][1]={type:"knight",color:"black"},e[0][6]={type:"knight",color:"black"},e[7][1]={type:"knight",color:"white"},e[7][6]={type:"knight",color:"white"},e[0][2]={type:"bishop",color:"black"},e[0][5]={type:"bishop",color:"black"},e[7][2]={type:"bishop",color:"white"},e[7][5]={type:"bishop",color:"white"},e[0][3]={type:"queen",color:"black"},e[7][3]={type:"queen",color:"white"},e[0][4]={type:"king",color:"black",hasMoved:!1},e[7][4]={type:"king",color:"white",hasMoved:!1},e},$=(e,t,o,c)=>{const a="white"===c?-1:1;if(t+a>=0&&t+a<8){if(o-1>=0){const s=e[t+a][o-1];if(s&&"pawn"===s.type&&s.color===c)return!0}if(o+1<8){const s=e[t+a][o+1];if(s&&"pawn"===s.type&&s.color===c)return!0}}const s=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];for(const[i,l]of s){const a=t+i,s=o+l;if(a>=0&&a<8&&s>=0&&s<8){const t=e[a][s];if(t&&"knight"===t.type&&t.color===c)return!0}}const r=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];for(const[i,l]of r){let a=t+i,s=o+l;for(;a>=0&&a<8&&s>=0&&s<8;){const r=e[a][s];if(r){if(r.color===c){if("queen"===r.type||"bishop"===r.type&&Math.abs(i)===Math.abs(l)||"rook"===r.type&&(0===i||0===l))return!0;if("king"===r.type&&Math.abs(a-t)<=1&&Math.abs(s-o)<=1)return!0}break}a+=i,s+=l}}return!1},T=(e,t)=>{const o=((e,t)=>{for(let o=0;o<8;o++)for(let c=0;c<8;c++){const a=e[o][c];if(a&&"king"===a.type&&a.color===t)return{row:o,col:c}}return null})(e,t);if(!o)return!1;const c="white"===t?"black":"white";return $(e,o.row,o.col,c)},P=(e,t,o,c,a,s)=>{if(t<0||t>7||o<0||o>7||c<0||c>7||a<0||a>7)return!1;const r=e[t][o];if(!r)return!1;const i=e[c][a];if(i&&i.color===r.color)return!1;let l=!1;switch(r.type){case"pawn":l=A(e,t,o,c,a,s);break;case"knight":l=I(t,o,c,a);break;case"bishop":l=E(e,t,o,c,a);break;case"rook":l=B(e,t,o,c,a);break;case"queen":l=H(e,t,o,c,a);break;case"king":l=D(e,t,o,c,a,s);break;default:l=!1}if(l){const{board:i}=J(e,t,o,c,a,s);if(T(i,r.color))return!1}return l},A=(e,t,o,c,a,s)=>{const r=e[t][o],i="white"===r.color?-1:1;if(o===a&&c===t+i&&!e[c][a])return!0;if(o===a&&!r.hasMoved&&c===t+2*i&&!e[t+i][o]&&!e[c][a])return!0;if(1===Math.abs(o-a)&&c===t+i){if(e[c][a]&&e[c][a].color!==r.color)return!0;if(!e[c][a]&&s.enPassantTarget&&c===s.enPassantTarget.row&&a===s.enPassantTarget.col)return!0}return!1},B=(e,t,o,c,a)=>{if(t!==c&&o!==a)return!1;if(t===c){const c=Math.min(o,a),s=Math.max(o,a);for(let o=c+1;o<s;o++)if(e[t][o])return!1}else{const a=Math.min(t,c),s=Math.max(t,c);for(let t=a+1;t<s;t++)if(e[t][o])return!1}return!0},I=(e,t,o,c)=>{const a=Math.abs(e-o),s=Math.abs(t-c);return 2===a&&1===s||1===a&&2===s},E=(e,t,o,c,a)=>{const s=Math.abs(t-c);if(s!==Math.abs(o-a))return!1;const r=t<c?1:-1,i=o<a?1:-1;for(let l=1;l<s;l++)if(e[t+l*r][o+l*i])return!1;return!0},H=(e,t,o,c,a)=>B(e,t,o,c,a)||E(e,t,o,c,a),D=(e,t,o,c,a,s)=>{const r=e[t][o],i=Math.abs(t-c),l=Math.abs(o-a);if(i<=1&&l<=1)return!0;if(0===i&&2===l&&!r.hasMoved&&!T(e,r.color))if(a>o){const o=e[t][7];if(o&&"rook"===o.type&&o.color===r.color&&!o.hasMoved&&!e[t][5]&&!e[t][6]){const o="white"===r.color?"black":"white";if(!$(e,t,5,o)&&!$(e,t,6,o))return!0}}else{const o=e[t][0];if(o&&"rook"===o.type&&o.color===r.color&&!o.hasMoved&&!e[t][1]&&!e[t][2]&&!e[t][3]){const o="white"===r.color?"black":"white";if(!$(e,t,2,o)&&!$(e,t,3,o))return!0}}return!1},G=(e,t)=>!(!e||"pawn"!==e.type)&&("white"===e.color&&0===t||"black"===e.color&&7===t),J=function(e,t,o,c,a,s){let r=arguments.length>6&&void 0!==arguments[6]?arguments[6]:null;const i=JSON.parse(JSON.stringify(e)),l=JSON.parse(JSON.stringify(s)),n=i[t][o],h=i[c][a];return"king"===n.type&&2===Math.abs(o-a)&&(a>o?(i[c][a-1]=i[c][7],i[c][7]=null):(i[c][a+1]=i[c][0],i[c][0]=null)),"pawn"!==n.type||o===a||h||(i[t][a]=null),l.enPassantTarget=null,"pawn"===n.type&&2===Math.abs(t-c)&&(l.enPassantTarget={row:(t+c)/2,col:o}),"king"===n.type?(l.castlingRights[n.color].kingSide=!1,l.castlingRights[n.color].queenSide=!1):"rook"===n.type&&(7===t&&0===o&&"white"===n.color?l.castlingRights.white.queenSide=!1:7===t&&7===o&&"white"===n.color?l.castlingRights.white.kingSide=!1:0===t&&0===o&&"black"===n.color?l.castlingRights.black.queenSide=!1:0===t&&7===o&&"black"===n.color&&(l.castlingRights.black.kingSide=!1)),"pawn"===n.type&&G(n,c)&&r?i[c][a]={type:r,color:n.color}:i[c][a]=n,i[t][o]=null,{board:i,gameState:l}},W=(e,t)=>{if(!T(e,t))return!1;for(let o=0;o<8;o++)for(let c=0;c<8;c++){const a=e[o][c];if(a&&a.color===t)for(let t=0;t<8;t++)for(let a=0;a<8;a++)if(P(e,o,c,t,a,{}))return!1}return!0},L=(e,t)=>{if(T(e,t))return!1;for(let o=0;o<8;o++)for(let c=0;c<8;c++){const a=e[o][c];if(a&&a.color===t)for(let t=0;t<8;t++)for(let a=0;a<8;a++)if(P(e,o,c,t,a,{}))return!1}return!0},F={pawn:10,knight:30,bishop:30,rook:50,queen:90,king:900},U={pawn:[[0,0,0,0,0,0,0,0],[5,5,5,5,5,5,5,5],[1,1,2,3,3,2,1,1],[.5,.5,1,2.5,2.5,1,.5,.5],[0,0,0,2,2,0,0,0],[.5,-.5,-1,0,0,-1,-.5,.5],[.5,1,1,-2,-2,1,1,.5],[0,0,0,0,0,0,0,0]],knight:[[-5,-4,-3,-3,-3,-3,-4,-5],[-4,-2,0,0,0,0,-2,-4],[-3,0,1,1.5,1.5,1,0,-3],[-3,.5,1.5,2,2,1.5,.5,-3],[-3,0,1.5,2,2,1.5,0,-3],[-3,.5,1,1.5,1.5,1,.5,-3],[-4,-2,0,.5,.5,0,-2,-4],[-5,-4,-3,-3,-3,-3,-4,-5]],bishop:[[-2,-1,-1,-1,-1,-1,-1,-2],[-1,0,0,0,0,0,0,-1],[-1,0,.5,1,1,.5,0,-1],[-1,.5,.5,1,1,.5,.5,-1],[-1,0,1,1,1,1,0,-1],[-1,1,1,1,1,1,1,-1],[-1,.5,0,0,0,0,.5,-1],[-2,-1,-1,-1,-1,-1,-1,-2]],rook:[[0,0,0,0,0,0,0,0],[.5,1,1,1,1,1,1,.5],[-.5,0,0,0,0,0,0,-.5],[-.5,0,0,0,0,0,0,-.5],[-.5,0,0,0,0,0,0,-.5],[-.5,0,0,0,0,0,0,-.5],[-.5,0,0,0,0,0,0,-.5],[0,0,0,.5,.5,0,0,0]],queen:[[-2,-1,-1,-.5,-.5,-1,-1,-2],[-1,0,0,0,0,0,0,-1],[-1,0,.5,.5,.5,.5,0,-1],[-.5,0,.5,.5,.5,.5,0,-.5],[0,0,.5,.5,.5,.5,0,-.5],[-1,.5,.5,.5,.5,.5,0,-1],[-1,0,.5,0,0,0,0,-1],[-2,-1,-1,-.5,-.5,-1,-1,-2]],king:[[-3,-4,-4,-5,-5,-4,-4,-3],[-3,-4,-4,-5,-5,-4,-4,-3],[-3,-4,-4,-5,-5,-4,-4,-3],[-3,-4,-4,-5,-5,-4,-4,-3],[-2,-3,-3,-4,-4,-3,-3,-2],[-1,-2,-2,-2,-2,-2,-2,-1],[2,2,0,0,0,0,2,2],[2,3,1,0,0,1,3,2]]},z=new Map,K=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]],Q={bishop:[[-1,-1],[-1,1],[1,-1],[1,1]],rook:[[-1,0],[0,-1],[0,1],[1,0]],queen:[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]},Y=(e,t,o,c)=>{const a=e[t][o];if(!a)return[];const s=[];switch(a.type){case"pawn":{const r="white"===a.color?-1:1;t+r>=0&&t+r<8&&!e[t+r][o]&&(s.push({fromRow:t,fromCol:o,toRow:t+r,toCol:o,isCapture:!1}),!a.hasMoved&&t+2*r>=0&&t+2*r<8&&!e[t+r][o]&&!e[t+2*r][o]&&s.push({fromRow:t,fromCol:o,toRow:t+2*r,toCol:o,isCapture:!1}));for(const i of[-1,1])o+i>=0&&o+i<8&&t+r>=0&&t+r<8&&(e[t+r][o+i]&&e[t+r][o+i].color!==a.color&&s.push({fromRow:t,fromCol:o,toRow:t+r,toCol:o+i,isCapture:!0}),!e[t+r][o+i]&&c.enPassantTarget&&t+r===c.enPassantTarget.row&&o+i===c.enPassantTarget.col&&s.push({fromRow:t,fromCol:o,toRow:t+r,toCol:o+i,isCapture:!0,isEnPassant:!0}));break}case"knight":for(const[c,r]of K){const i=t+c,l=o+r;if(i>=0&&i<8&&l>=0&&l<8){const c=e[i][l];c&&c.color===a.color||s.push({fromRow:t,fromCol:o,toRow:i,toCol:l,isCapture:!!c})}}break;case"bishop":case"rook":case"queen":{const c=Q[a.type];for(const[r,i]of c){let c=t+r,l=o+i;for(;c>=0&&c<8&&l>=0&&l<8;){const n=e[c][l];if(n){n.color!==a.color&&s.push({fromRow:t,fromCol:o,toRow:c,toCol:l,isCapture:!0});break}s.push({fromRow:t,fromCol:o,toRow:c,toCol:l,isCapture:!1}),c+=r,l+=i}}break}case"king":for(let c=-1;c<=1;c++)for(let r=-1;r<=1;r++){if(0===c&&0===r)continue;const i=t+c,l=o+r;if(i>=0&&i<8&&l>=0&&l<8){const c=e[i][l];c&&c.color===a.color||s.push({fromRow:t,fromCol:o,toRow:i,toCol:l,isCapture:!!c})}}if(!a.hasMoved&&c.castlingRights){const r=c.castlingRights[a.color];r&&r.kingSide&&!e[t][o+1]&&!e[t][o+2]&&e[t][o+3]&&"rook"===e[t][o+3].type&&!e[t][o+3].hasMoved&&s.push({fromRow:t,fromCol:o,toRow:t,toCol:o+2,isCapture:!1,isCastling:!0,castlingSide:"kingside"}),!r||!r.queenSide||e[t][o-1]||e[t][o-2]||e[t][o-3]||!e[t][o-4]||"rook"!==e[t][o-4].type||e[t][o-4].hasMoved||s.push({fromRow:t,fromCol:o,toRow:t,toCol:o-2,isCapture:!1,isCastling:!0,castlingSide:"queenside"})}}return s},V=function(e,t,o){let c=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"medium",a=((e,t,o)=>{const c=[],a=[];for(let s=0;s<8;s++)for(let c=0;c<8;c++){const r=e[s][c];if(r&&r.color===t){const t=Y(e,s,c,o);a.push(...t)}}for(const s of a){const{fromRow:t,fromCol:a,toRow:r,toCol:i}=s;P(e,t,a,r,i,o)&&c.push(s)}return c})(e,t,o);if(0===a.length)return null;if(1===a.length)return a[0];const s="easy"===c?.3:"medium"===c?.15:.05;if(Math.random()<s){return a[Math.floor(Math.random()*a.length)]}const r=(e=>{let t="";for(let o=0;o<8;o++)for(let c=0;c<8;c++){const a=e[o][c];a&&(t+=`${o}${c}${a.type[0]}${a.color[0]}`)}return t})(e),i=`${r}-${t}-${c}`;if(z.has(i))return z.get(i);const l=a.map((t=>{const o=((e,t)=>{const{fromRow:o,fromCol:c,toRow:a,toCol:s}=t,r=e[o][c],i=e[a][s];let l=0;i&&(l+=2*F[i.type]);const n=U[r.type]["white"===r.color?o:7-o][c];l+=.5*(U[r.type]["white"===r.color?a:7-a][s]-n),l+=.2*(7-(Math.abs(3.5-a)+Math.abs(3.5-s))),"pawn"===r.type&&(l+=.5*("white"===r.color?7-a:a),("white"===r.color&&a<=1||"black"===r.color&&a>=6)&&(l+=5));return"king"===r.type&&(l-=2),"knight"!==r.type&&"bishop"!==r.type||!("white"===r.color&&7===o||"black"===r.color&&0===o)||(l+=1),l})(e,t);return{...t,score:o}}));l.sort(((e,o)=>"white"===t?o.score-e.score:e.score-o.score));const n="easy"===c?5:"medium"===c?3:2,h=l.slice(0,Math.min(n,l.length)),b=h[Math.floor(Math.random()*h.length)];return z.set(i,b),z.size>1e3&&z.clear(),b},X=(e,t,o,c)=>V(e,t,o,c);var Z=function(){const[e,t]=Object(c.useState)(R()),[o,a]=Object(c.useState)(null),[s,r]=Object(c.useState)("white"),[i,l]=Object(c.useState)("ongoing"),[n,h]=Object(c.useState)([]),[b,u]=Object(c.useState)({enPassantTarget:null,castlingRights:{white:{kingSide:!0,queenSide:!0},black:{kingSide:!0,queenSide:!0}}}),[d,m]=Object(c.useState)([]),[g,j]=Object(c.useState)(null),[p,f]=Object(c.useState)("medium"),[w,O]=Object(c.useState)(!1),[v,C]=Object(c.useState)(null),[y,$]=Object(c.useState)(null),[A,B]=Object(c.useState)("classic"),[I,E]=Object(c.useState)(!1),H=Object(c.useRef)(null),D=Object(c.useCallback)((function(o,c,s,i){let l=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null;const{board:n,gameState:d,capturedPiece:g}=J(e,o,c,s,i,b,l);t(n),u(d);const j=e[o][c],p={from:{row:o,col:c},to:{row:s,col:i},piece:j,capturedPiece:g,notation:z(j,o,c,s,i,g,l),color:j.color};h((e=>[...e,p])),r((e=>"white"===e?"black":"white")),a(null),m([]),O(!1),C(null)}),[e,b,z]);Object(c.useEffect)((()=>{H.current=D}),[D]);const F=Object(c.useCallback)((()=>{"black"===s&&"ongoing"===i&&(E(!0),requestAnimationFrame((()=>{try{const t=X(e,"black",b,p);if(t){const{fromRow:o,fromCol:c,toRow:a,toCol:s}=t,r=e[o][c];G(r,a)?H.current(o,c,a,s,"queen"):H.current(o,c,a,s)}else{const t=[];for(let o=0;o<8;o++)for(let c=0;c<8;c++){const a=e[o][c];if(a&&"black"===a.color)for(let s=0;s<8;s++)for(let a=0;a<8;a++)P(e,o,c,s,a,b)&&t.push({fromRow:o,fromCol:c,toRow:s,toCol:a})}if(t.length>0){const e=t[Math.floor(Math.random()*t.length)],{fromRow:o,fromCol:c,toRow:a,toCol:s}=e;H.current(o,c,a,s)}}setTimeout((()=>{E(!1)}),200)}catch(t){console.error("Error in AI move calculation:",t),E(!1)}})))}),[e,s,i,b,p]);Object(c.useEffect)((()=>{n.length>0&&(T(e,"white")?(j("white"),W(e,"white")&&l("Checkmate! Black wins.")):T(e,"black")?(j("black"),W(e,"black")&&l("Checkmate! White wins.")):j(null),("white"===s&&L(e,"white")||"black"===s&&L(e,"black"))&&l("Draw by stalemate"))}),[e,s,n]),Object(c.useEffect)((()=>{"black"===s&&"ongoing"===i&&F()}),[s,i,F]);const U=Object(c.useMemo)((()=>{if(!o)return[];const t=[];for(let c=0;c<8;c++)for(let a=0;a<8;a++)P(e,o.row,o.col,c,a,b)&&t.push({row:c,col:a});return t}),[o,e,b]);Object(c.useEffect)((()=>{m(U)}),[U]),Object(c.useCallback)((e=>{switch(e){case"pawn":default:return"";case"knight":return"N";case"bishop":return"B";case"rook":return"R";case"queen":return"Q";case"king":return"K"}}),[]);const z=Object(c.useCallback)(((e,t,o,c,a,s,r)=>{const i=["a","b","c","d","e","f","g","h"],l=["8","7","6","5","4","3","2","1"],n=i[o]+l[t],h=i[a]+l[c];let b="";return"pawn"!==e.type&&(b+=e.type.charAt(0).toUpperCase()),s&&("pawn"===e.type&&(b+=n.charAt(0)),b+="x"),b+=h,r&&(b+="="+r.charAt(0).toUpperCase()),b}),[]),K=Object(c.useCallback)(((t,c)=>{if("ongoing"!==i||y)return;if("white"!==s)return;const r=e[t][c];if(o){if(o.row===t&&o.col===c)return void a(null);if(r&&r.color===s)return void a({row:t,col:c,piece:r});if(P(e,o.row,o.col,t,c,b)){if(G(o.piece,t)){const e=document.querySelector(".chess-board").getBoundingClientRect(),a=e.width/8;return void $({fromRow:o.row,fromCol:o.col,toRow:t,toCol:c,position:{x:e.left+c*a+a/2,y:e.top+t*a+a/2}})}D(o.row,o.col,t,c)}}else r&&r.color===s&&a({row:t,col:c,piece:r})}),[e,b,i,D,s,y,o]),Q=Object(c.useCallback)((e=>{if(!y)return;const{fromRow:t,fromCol:o,toRow:c,toCol:a}=y;D(t,o,c,a,e),$(null)}),[D,y]),Y=Object(c.useCallback)((()=>{t(R()),a(null),r("white"),l("ongoing"),h([]),u({enPassantTarget:null,castlingRights:{white:{kingSide:!0,queenSide:!0},black:{kingSide:!0,queenSide:!0}}}),m([]),j(null),O(!1),C(null),$(null)}),[]),V=Object(c.useCallback)((e=>{f(e),Y()}),[Y]),Z=Object(c.useCallback)((()=>{if("white"===s&&"ongoing"===i){const t=X(e,"white",b,2);t&&(O(!0),C(t))}}),[e,b,i,s]),_=Object(c.useCallback)((e=>{B(e),localStorage.setItem("chessTheme",e)}),[]);Object(c.useEffect)((()=>{const e=localStorage.getItem("chessTheme");e&&S[e]&&B(e)}),[]);const ee=Object(c.useMemo)((()=>n.length>0?n[n.length-1]:null),[n]),te=Object(c.useMemo)((()=>S[A]),[A]);return Object(k.jsxs)("div",{className:"app",children:[Object(k.jsxs)("div",{className:"app-header",children:[Object(k.jsx)("h1",{children:"AI Chess"}),Object(k.jsx)("div",{className:"author-credits",children:Object(k.jsx)("span",{children:"Created by Aditya Thakkar"})})]}),Object(k.jsxs)("div",{className:"difficulty-selector",children:[Object(k.jsx)("span",{className:"difficulty-label",children:"AI Difficulty:"}),Object(k.jsxs)("div",{className:"difficulty-buttons",children:[Object(k.jsx)("button",{className:"difficulty-button "+("easy"===p?"active":""),onClick:()=>V("easy"),children:"Easy"}),Object(k.jsx)("button",{className:"difficulty-button "+("medium"===p?"active":""),onClick:()=>V("medium"),children:"Medium"}),Object(k.jsx)("button",{className:"difficulty-button "+("hard"===p?"active":""),onClick:()=>V("hard"),children:"Hard"})]})]}),Object(k.jsx)(q,{currentTheme:A,onThemeChange:_}),Object(k.jsxs)("div",{className:"game-container",children:[Object(k.jsx)(x,{board:e,selectedPiece:o,onSquareClick:K,highlightedSquares:d,checkIndicator:g,lastMove:ee,hintMove:w?v:null,theme:te}),Object(k.jsx)(N,{playerTurn:s,gameStatus:i,moveHistory:n,onResetGame:Y,isInCheck:null!==g,aiDifficulty:p,onGetHint:Z,aiThinking:I})]}),y&&Object(k.jsx)(M,{position:y.position,color:"white",onSelect:Q,onCancel:()=>$(null)}),Object(k.jsx)("div",{className:"app-footer",children:Object(k.jsxs)("div",{className:"footer-content",children:[Object(k.jsx)("p",{children:"Chess AI with Minimax Algorithm & Alpha-Beta Pruning"}),Object(k.jsxs)("p",{children:["\xa9 ",(new Date).getFullYear()," AI Chess by Aditya Thakkar"]})]})})]})};r.a.render(Object(k.jsx)(a.a.StrictMode,{children:Object(k.jsx)(Z,{})}),document.getElementById("root"))}],[[15,1,2]]]);
//# sourceMappingURL=main.f279bc36.chunk.js.map