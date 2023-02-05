let sel;

function dropdown() {
  textAlign(CENTER);
  background(200);
  sel = createSelect();
  sel.position(0, 1);
  sel.option('pear');
  sel.option('kiwi');
  sel.option('grape');
  sel.selected('kiwi');
  sel.changed(mySelectEvent);
}

function mySelectEvent() {
  let item = sel.value();
  background(200);
  text('It is a ' + item + '!', 50, 50);
}