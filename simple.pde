void setup() {
  size(1020, 900);
}

void draw() {
  Table table = loadTable("test.csv", "header, csv");
  background(255);
  for(int i = 0; i < 100; ++i) {;
    TableRow row = table.getRow(i);
    int rank = row.getInt("rank");
    float growth = row.getFloat("change_inPercent");
    line(rank*10, 400, rank*10, 400 + growth*15);
  }
}

