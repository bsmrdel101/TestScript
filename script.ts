export const scripts: string[] = [];

scripts.push(`
  var name = "BEAN";
  print "My name is: ";
  print name;

  print (1 + 1 * (4 - 3)) * 4 / 2;
  print 6;

  var num1 = 8 * (16 - 2);
  var num2 = 7 * 3 + 2;
  print num1 + num2;

  if (num1 > (10 + 5)) {
    print "num1 is bigger";
  }
`);
