const request = require('request');
const Iconv = require('iconv').Iconv;
const cheerio = require('cheerio');

class Stock {
  constructor(
	name, rank, price, change_inValue, change_inPercent, updown) {
	this.name = name;
	this.rank = rank;
    this.price = price;
	this.change_inValue = change_inValue;
	this.change_inPercent = change_inPercent;
	this.updown = updown;
  }
  speak() {
	  console.log(`
		name : ${this.name} 
		price : ${this.price} 
		change_inValue : ${this.change_inValue} 
		change_inPercent : ${this.change_inPercent} 
		updown : ${this.updown}
	  `);
    }
}


request({ url: 'https://finance.naver.com/sise/sise_quant.nhn', encoding: null }, function(err, response, body) {
	const ObjectsToCsv = require('objects-to-csv');
	const euckr_to_utf8 = new Iconv('euc-kr', 'utf8');
	const koreanHTML = euckr_to_utf8.convert(body).toString();
	const $ = cheerio.load(koreanHTML)
	
	let name, rank, price, change_inValue, change_inPercent, updown;
	let stock_s = [];

	const table = $('.type_2').children('tbody').children('tr'); 
	//3번쨰부터 5개, 빈라인 3개, 이렇게 해서 종목 100개
	
	for(let i = 1; i < table.length; ++i) {
		const tr = table[i];
		if(tr.children.length === 1) {
			continue;
		}
		
		const tds =  tr.children;
		for(let j = 0; j < tds.length; ++j) {
			const td = tds[j];
			if(td.type == 'text') {
				continue;
			}
			
			const td_data = td.children;			
	
			if(j == 1) {
				rank = td_data[0].data
			}
			
			else if(j == 3) {
				name = td_data[0].children[0].data;
			}
			
			else if(j == 5) {
				price = parseInt(td_data[0].data.replace(/[,]/g,''))
			}
			
			else if(j == 7) {		
				let data = 0;
				
				if(td_data[2].children != undefined) {
					data = parseInt(td_data[2].children[0].data.replace(/[\n\t,]/g,''));
				}

				change_inValue = data;

			}
			
			else if(j == 9) {
				change_inPercent = td_data[1].children[0].data.replace(/[\n\t%]/g,'');
				
				if (change_inPercent.indexOf('.') !== -1) { //소수
					change_inPercent = parseFloat(change_inPercent.replace(/,/g,''));
				}
			
				else { //정수
					change_inPercent = parseInt(change_inPercent.replace(/,/g,''));
				}
				
				if(change_inPercent < 0) {
					updown = '하락';
					change_inValue = -change_inValue
				}
				else if(change_inPercent > 0) {
					updown = '상승';
					change_inValue = change_inValue
				}
				else {
					updown = '그대로';
					change_inValue = 0;
				}				
				const temp = new Stock(
					name, rank, price, change_inValue, change_inPercent, updown);
				
				stock_s.push(temp);
			}
		}
	}
	const csv = new ObjectsToCsv(stock_s);
	csv.toDisk('./test.csv');
})
