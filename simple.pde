void setup() {
  size(1020, 900);
  colorMode(HSB, 360, 100, 100);
  strokeWeight(5);
}

void draw() {
  Table table = loadTable("2020_08_08_14_05.csv", "header, csv");
  background(0,0,100);
  for(int i = 0; i < 100; ++i) {;
    TableRow row = table.getRow(i);
    int rank = row.getInt("rank");
    float growth = row.getFloat("change_inPercent");
    float abs_growth = abs(growth);
    float S = map(abs_growth, 0, 40, 10, 100);
    
    if(growth > 0) {
      stroke(0, S, 80);
      line(rank*5, 400, rank*5, 400 + growth*10+10);
    }
    
    else {
      stroke(240, S, 80);
      line(rank*5, 400, rank*5, 400 + growth*10-10);
    }
  }
}
