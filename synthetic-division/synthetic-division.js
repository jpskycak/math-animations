var draw = SVG('drawing')
var dt = 1500

var screenpx = 300
var top_row = ['3', '2', '-5', '-7', '11']
var n_cols = top_row.length
var cellpx = screenpx / n_cols

var op_rad = 0.2
var op_ctr_x = 0.2
var op_ctr_y = 1.5 - op_rad
var op_highlight = '#ddf'

function init_arr() {
  var arr = [
    top_row, [],
    []
  ]
  for (j = 0; j < n_cols; j++) {
    arr[1].push('')
    arr[2].push('')
  }
  return arr
}

function init_cell_empty() {
  var cell_empty = [
    [],
    [],
    []
  ]
  for (j = 0; j < n_cols; j++) {
    cell_empty[0].push(true)
    cell_empty[1].push(true)
    cell_empty[2].push(true)
  }
  return cell_empty
}

function draw_op_symbol() {

  var op_symbol = draw.polyline([
    [op_ctr_x * cellpx, op_ctr_y * cellpx],
    [op_ctr_x * cellpx, (op_ctr_y - op_rad) * cellpx],
    [op_ctr_x * cellpx, op_ctr_y * cellpx],
    [(op_ctr_x + op_rad) * cellpx, op_ctr_y * cellpx],
    [op_ctr_x * cellpx, op_ctr_y * cellpx],
    [op_ctr_x * cellpx, (op_ctr_y + op_rad) * cellpx],
    [op_ctr_x * cellpx, op_ctr_y * cellpx],
    [(op_ctr_x - op_rad) * cellpx, op_ctr_y * cellpx],
    [op_ctr_x * cellpx, op_ctr_y * cellpx]
  ]).fill('none').stroke({
    width: 2,
    linecap: 'round',
    linejoin: 'round'
  }).rotate(-45)
  return op_symbol
}

function draw_indicator() {
  var indicator = draw.rect(0.7 * cellpx, 0.7 * cellpx).radius(10).fill('#fff')
  return indicator
}

function draw_corner() {
  var corner = draw.polyline([
    [cellpx, 0],
    [cellpx, cellpx * 2],
    [cellpx * n_cols, cellpx * 2]
  ]).move(0.75 * cellpx, 0).fill('none').stroke({
    width: 4,
    linecap: 'round',
    linejoin: 'round'
  })
  return corner
}

function draw_cell(i, j, arr, cell_empty) {
  if (cell_empty[i][j]) {
    if (arr[i][j] != '') {
      draw.text(arr[i][j]).font({
        size: 0.6 * cellpx
      }).move(j * cellpx, i * cellpx)
      cell_empty[i][j] = false
    }
  }
}

function draw_arr(arr, cell_empty) {
  for (i = 0; i < 3; i++) {
    for (j = 0; j < n_cols; j++) {
      draw_cell(i, j, arr, cell_empty)
    }
  }
}

function get_col(cell_empty) {
  var j = 1
  while (j < n_cols && !cell_empty[2][j]) {
    j++
  }
  return j
}

function add_col(arr, cell_empty) {
  j = get_col(cell_empty)
  arr[2][j] = (Number(arr[0][j]) + Number(arr[1][j])).toString()
  draw_arr(arr, cell_empty)
}

function fill_col(arr, cell_empty) {
  j = get_col(cell_empty)
  if (j == 1) {
    arr[1][1] = '0'
  } else {
    arr[1][j] = (Number(arr[0][0]) * Number(arr[2][j - 1])).toString()
  }
  draw_arr(arr, cell_empty)
}

function add_col_rotate_symbol(j,op_symbol,indicator) {
	indicator.move(0, cellpx).animate().fill(op_highlight)
  var angle = [0,-90,-180,-270][j%4]
  //draw.text(angle.toString()).move(3*cellpx,(3+j/2)*cellpx) // for debugging rotation animation (really counterintuitive)
  op_symbol.animate().rotate(angle)
}

function fill_col_rotate_symbol(j,op_symbol,indicator) {
	indicator.move(0, cellpx).animate().fill(op_highlight)
  var angle = [-45,-90-45,-180-45,90-45][(j-1)%4]
  //draw.text(angle.toString()).move(4*cellpx,(3+(j-1)/2)*cellpx) // for debugging rotation animation (really counterintuitive)
  op_symbol.animate().rotate(angle)
}

function move_indicator(indicator,i,j) {
indicator.animate().move(j*cellpx,i*cellpx)
}

function show_indicator(indicator) {
  indicator.animate().fill('#ff9')
}

function hide_indicator(indicator) {
indicator.animate().fill('#fff')
}

function add_col_indicators_diverge(indicator0,indicator1,indicator2,op_symbol,cell_empty) {
  var j = get_col(cell_empty)
   move_indicator(indicator1,0,j)
   move_indicator(indicator2,1,j)
   add_col_rotate_symbol(j,op_symbol,indicator0)
}

function add_col_indicators_converge(indicator0,indicator1,indicator2,op_symbol,cell_empty) {
  var j = get_col(cell_empty)
   move_indicator(indicator1,2,j)
   move_indicator(indicator2,2,j)
   hide_indicator(indicator0)
   }
   
function fill_col_indicators_diverge(indicator0,indicator1,indicator2,op_symbol,cell_empty) {
  var j = get_col(cell_empty)
   move_indicator(indicator1,0,0)
   move_indicator(indicator2,2,j-1)
   fill_col_rotate_symbol(j,op_symbol,indicator0)
}

function fill_col_indicators_converge(indicator0,indicator1,indicator2,op_symbol,cell_empty) {
  var j = get_col(cell_empty)
   move_indicator(indicator1,1,j)
   move_indicator(indicator2,1,j)
   hide_indicator(indicator0)
   }

function loop_once() {
  draw.clear()

  var indicator0 = draw_indicator().move(0, cellpx)
  var indicator1 = draw_indicator()
  var indicator2 = draw_indicator()

  var op_symbol = draw_op_symbol()
  var corner = draw_corner()

  var arr = init_arr()
  var cell_empty = init_cell_empty()

  draw_arr(arr, cell_empty)
  move_indicator(indicator1,1,1)
  move_indicator(indicator2,1,1)
  
  setTimeout(function(){show_indicator(indicator1)},dt)
  setTimeout(function(){show_indicator(indicator2)},dt)
  
  setTimeout(function(){fill_col(arr,cell_empty)},2*dt)
  
  setTimeout(function(){add_col_indicators_diverge(indicator0,indicator1,indicator2,op_symbol,cell_empty)},3*dt)
  
  setTimeout(function(){add_col_indicators_converge(indicator0,indicator1,indicator2,op_symbol,cell_empty)},4*dt)
  
  setTimeout(function(){add_col(arr,cell_empty)},5*dt)
  
  
  dt_offset = 5
  
  for (n = 1; n < n_cols-1; n++) {
  
  setTimeout(function(){fill_col_indicators_diverge(indicator0,indicator1,indicator2,op_symbol,cell_empty)},(6 * n -5 + dt_offset) * dt)
  
  setTimeout(function(){fill_col_indicators_converge(indicator0,indicator1,indicator2,op_symbol,cell_empty)},(6 * n - 4 + dt_offset) * dt)
  
  setTimeout(function(){fill_col(arr,cell_empty)},(6 * n -3 + dt_offset) * dt)
  
  setTimeout(function(){add_col_indicators_diverge(indicator0,indicator1,indicator2,op_symbol,cell_empty)},(6 * n -2 + dt_offset) * dt)
  
  setTimeout(function(){add_col_indicators_converge(indicator0,indicator1,indicator2,op_symbol,cell_empty)},(6 * n - 1 + dt_offset) * dt)
  
  setTimeout(function(){add_col(arr,cell_empty)},(6 * n + dt_offset) * dt)
  
  }
  
  setTimeout(function(){hide_indicator(indicator1)},(6 * (n_cols-2)+dt_offset)*dt+dt)
  setTimeout(function(){hide_indicator(indicator2)},(6 * (n_cols-2)+dt_offset)*dt+dt)

}

loop_once()
setInterval(loop_once, (6 * (n_cols-2)+dt_offset) * dt+4*dt)
