var draw = SVG('drawing')
var screenpx = 300
var arr = [
  ['-2', '1', '4', '-3', '0', '1'],
  [],
  []
]
var n_cols = arr[0].length
for (j = 0; j < n_cols; j++) {
  arr[1].push('')
  arr[2].push('')
}
var cellpx = screenpx / n_cols

var op_rad = 0.2
var op_ctr_x = 0.33
var op_ctr_y = 1.5 - op_rad
var op_indicator = draw.rect(0.7 * cellpx, 0.7 * cellpx).radius(10).move(0, cellpx).fill('#fff')
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

var indicator1 = draw.rect(0.7 * cellpx, 0.7 * cellpx).radius(10).fill('#fff')
var indicator2 = draw.rect(0.7 * cellpx, 0.7 * cellpx).radius(10).fill('#fff')

var corner = draw.polyline([
  [cellpx, 0],
  [cellpx, cellpx * 2],
  [cellpx * n_cols, cellpx * 2]
]).move(0.75 * cellpx, 0).fill('none').stroke({
  width: 4,
  linecap: 'round',
  linejoin: 'round'
})

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

function draw_cell(i, j) {
  draw.text(arr[i][j]).font({
    size: 0.6 * cellpx
  }).move(j * cellpx, i * cellpx)
}

function update_cell(i, j) {
  if (cell_empty[i][j]) {
    if (arr[i][j] != '') {
      draw_cell(i, j)
      cell_empty[i][j] = false
    }
  }
}

function draw_arr() {
  for (i = 0; i < 3; i++) {
    for (j = 0; j < n_cols; j++) {
      update_cell(i, j)
    }
  }
}

function fill_col(j) {
  if (j == 1) {
    arr[1][1] = '0'
  } else {
    arr[1][j] = (Number(arr[0][0]) * Number(arr[2][j - 1])).toString()
  }
  draw_arr()
}

function add_col(j) {
  arr[2][j] = (Number(arr[0][j]) + Number(arr[1][j])).toString()
  draw_arr()
}

function show_indicators() {
  indicator1.fill('#ff9')
  indicator2.fill('#ff9')
}

function hide_indicators() {
  indicator1.fill('#fff')
  indicator2.fill('#fff')
}

function move_indicators(ij1, ij2) {
  indicator1.animate().move(ij1[0] * cellpx, ij1[1] * cellpx)
  indicator2.animate().move(ij2[0] * cellpx, ij2[1] * cellpx)
}

function get_col() {
  var j = 1
  while (j < n_cols && !cell_empty[2][j]) {
    j++
  }
  return j
}

function fill_col_automatic() {
  j = get_col()
  fill_col(j)
}

function add_col_automatic() {
  j = get_col()
  add_col(j)
}

var op_highlight = '#ddf'

function fill_col_rotate_symbol(j) {
  op_indicator.move(0, cellpx).animate().fill(op_highlight)
  if (j % 4 == 0) {
    op_symbol.animate().rotate(-315)
  } else if (j % 4 == 1) {
    op_symbol.animate().rotate(-45)
  } else if (j % 4 == 2) {
    op_symbol.animate().rotate(-135)
  } else if (j % 4 == 3) {
    op_symbol.animate().rotate(-225)
  }
}

function add_col_rotate_symbol(j) {
  op_indicator.move(0, cellpx).animate().fill(op_highlight)
  var nrev = Math.floor((j + 1) / 4)
  if (j % 4 == 0) {
    op_symbol.animate().rotate(0)
  } else if (j % 4 == 1) {
    op_symbol.animate().rotate(-90)
  } else if (j % 4 == 2) {
    op_symbol.animate().rotate(-180)
  } else if (j % 4 == 3) {
    op_symbol.animate().rotate(-270)
  }
}

function fill_col_indicators1() {
  j = get_col()
  if (j > 1 && j < n_cols) {
    move_indicators([0, 0], [j - 1, 2])
    fill_col_rotate_symbol(j)
  } else if (j >= n_cols) {
    hide_indicators()
  }
}

function fill_col_indicators2() {
  j = get_col()
  if (j > 0 && j < n_cols) {
    move_indicators([j, 1], [j, 1])
    op_indicator.animate().fill('#fff')
  } else if (j >= n_cols) {
    hide_indicators()
  }
}

function add_col_indicators1() {
  j = get_col()
  if (j > 0 && j < n_cols) {
    move_indicators([j, 0], [j, 1])
    add_col_rotate_symbol(j)
  } else if (j >= n_cols) {
    hide_indicators()
  }
}

function add_col_indicators2() {
  j = get_col()
  if (j > 0 && j < n_cols) {
    move_indicators([j, 2], [j, 2])
    op_indicator.animate().fill('#fff')
  } else if (j >= n_cols) {
    hide_indicators()
  }
}

draw_arr()
move_indicators([1, 1], [1, 1])
var dt = 1500
setTimeout(show_indicators, dt)
setTimeout(fill_col_automatic, 2 * dt)
setTimeout(add_col_indicators1, 3 * dt)
setTimeout(add_col_indicators2, 4 * dt)
setTimeout(add_col_automatic, 5 * dt)

var offset = 5 * dt
for (n = 1; n < n_cols; n++) {
  setTimeout(fill_col_indicators1, (6 * (n - 1) + 1) * dt + offset)
  setTimeout(fill_col_indicators2, (6 * (n - 1) + 2) * dt + offset)
  setTimeout(fill_col_automatic, (6 * (n - 1) + 3) * dt + offset)
  setTimeout(add_col_indicators1, (6 * (n - 1) + 4) * dt + offset)
  setTimeout(add_col_indicators2, (6 * (n - 1) + 5) * dt + offset)
  setTimeout(add_col_automatic, (6 * (n - 1) + 6) * dt + offset)
}