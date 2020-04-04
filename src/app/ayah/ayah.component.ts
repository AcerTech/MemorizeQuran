import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AyahService } from "../ayah.service";
import { Ayah } from "../models/ayah";
import { SuraIndex } from '../models/suraIndex';
import { Options } from 'ng5-slider';

@Component({
  selector: 'mq-ayah',
  templateUrl: './ayah.component.html',
  styleUrls: ['./ayah.component.css']
})
export class AyahComponent implements OnInit {
  @Output() onCreate: EventEmitter<any> = new EventEmitter<any>();
  show = false;
  rowIndex: number;
  hideVerses = false;
  filteredVerses: Ayah[] = [];
  allVerses: Ayah[] = [];
  suraIndexes: SuraIndex[] = [];
  errorMsg: string;
  selectedSuraName: string;
  totalAyat: number;
  suraForm: FormGroup;
  suraVersesNumbersArray: number[] = []

  sura: {
    suraId: number,
    fromVerse: number,
    toVerse: number,
    hideVerses: boolean
  }

  ayahTrimed: string

  constructor(
    private fb: FormBuilder,
    private ayahService: AyahService) { }


  ngOnInit() {

 
    this.getSuraIndexes()
    
    this.suraForm = this.fb.group({
      suraId: [1],
      fromVerse: [1],
      toVerse: [7],
      hideVerses: [false],
    })

    // this.suraForm.controls['suraId'].patchValue(1)
    // this.suraForm.controls['fromVerse'].patchValue(1)
    // this.suraForm.controls['toVerse'].patchValue(7)

    var suraInfo = JSON.parse(localStorage.getItem("suraInfo"));
    console.log(suraInfo)
    if (suraInfo != null && suraInfo != undefined) {
      this.hideVerses = suraInfo.hideVerses;
      this.suraForm.reset();
      this.suraForm.controls['suraId'].patchValue(suraInfo.suraId)
      this.suraForm.controls['fromVerse'].patchValue(suraInfo.fromVerse)
      this.suraForm.controls['toVerse'].patchValue(suraInfo.toVerse)
    }

    
    this.getAyat()
    this.openNav()
  }

  toggle(rowIndex: number) {
    this.show = !this.show
    this.rowIndex = rowIndex
    // console.log(rowIndex)
  }

  getAyat() {

    this.ayahService.getAyat()
      .subscribe(
        _ayat => this.allVerses = _ayat,
        error => this.errorMsg = <any>error,
        () => {
          this.getSuraIndexes()
          this.getFilteredVerses()
          // console.log(this.allVerses)
        }
      )

  }

  storeFormData() {
    var formValues = this.suraForm.getRawValue();
    // this.sura.suraId = formValues.suraId
    // this.sura.fromVerse = formValues.fromVerse
    // this.sura.toVerse = formValues.toVerse
    // this.sura.hideVerses = formValues.hideVerses
    // console.log('sura ' + this.sura)
    localStorage.setItem("suraInfo", JSON.stringify({
      suraId: formValues.suraId,
      fromVerse: formValues.fromVerse,
      toVerse: formValues.toVerse,
      hideVerses: this.hideVerses
    }));
  }

  getFilteredVerses() {
    // this.getAyatTotals()
    var formValues = this.suraForm.getRawValue();

    // console.log(formValues)
    if (this.allVerses.length > 0) {
      this.filteredVerses = []
      this.filteredVerses = this.allVerses.filter(el => (el.suraId == formValues.suraId) && el.verseId >= Number(formValues.fromVerse) && el.verseId <= Number(formValues.toVerse))

      this.getSuraInfo()
      this.fillSuraVersesNumbersArray()
    }

  }

  getSuraInfo() {
    var formValues = this.suraForm.getRawValue();

    this.selectedSuraName = this.suraIndexes.filter(x => x.suraId === formValues.suraId).map(x => x.suraName).toString()
    this.totalAyat = Number(this.suraIndexes.filter(x => x.suraId == formValues.suraId).map(x => x.totalAya))
  }

  fillSuraVersesNumbersArray() {
    var formValues = this.suraForm.getRawValue();
     this.totalAyat = Number(this.suraIndexes.filter(x => x.suraId == formValues.suraId).map(x => x.totalAya))
    this.suraVersesNumbersArray = []
    for (let index = 1; index < this.totalAyat + 1; index++) {
      this.suraVersesNumbersArray.push(index);
    }
  }

  suraChanged() {
    this.fillSuraVersesNumbersArray()
    var formValues = this.suraForm.getRawValue();
    this.totalAyat = null
    this.totalAyat = Number(this.suraIndexes.filter(x => x.suraId == formValues.suraId).map(x => x.totalAya))

    this.filteredVerses = []
    this.filteredVerses = this.allVerses.filter(el => (el.suraId == formValues.suraId))// && el.verseId >= Number(formValues.fromVerse) && el.verseId <= this.totalAyat)
    this.selectedSuraName = this.suraIndexes.filter(x => x.suraId === formValues.suraId).map(x => x.suraName).toString()
    this.totalAyat = Number(this.suraIndexes.filter(x => x.suraId == formValues.suraId).map(x => x.totalAya))
    // console.log(this.totalAyat)
    this.suraForm.controls['toVerse'].patchValue(this.totalAyat.toString())
    this.suraForm.controls['fromVerse'].patchValue(1)
    // this.getSuraInfo()
    this.storeFormData()
  }



  replaceAll(orgTxt, replacement) {
    this.ayahTrimed = ""
    var noTashkel = this.removeTashkeel1(orgTxt)//this.removeTashkeel2(orgTxt)
    this.ayahTrimed = noTashkel.replace(/./g, '-');
    return this.ayahTrimed
  }


  isCharTashkeel(letter) {
    var CHARCODE_SHADDA = 1617;
    var CHARCODE_SUKOON = 1618;
    var CHARCODE_SUPERSCRIPT_ALIF = 1648;
    var CHARCODE_TATWEEL = 1600;
    var CHARCODE_ALIF = 1575;
    if (typeof (letter) == "undefined" || letter == null)
      return false;

    var code = letter.charCodeAt(0);
    //1648 - superscript alif
    //1619 - madd: ~
    return (code == CHARCODE_TATWEEL || code == CHARCODE_SUPERSCRIPT_ALIF || code >= 1612 && code <= 1631); //tashkeel
  }

  removeTashkeel1(input) {
    var output = "";
    //todo consider using a stringbuilder to improve performance
    for (var i = 0; i < input.length; i++) {
      var letter = input.charAt(i);
      if (!this.isCharTashkeel(letter)) //tashkeel
        output += letter;
    }
    return output;
  }


  getSuraIndexes() {
    this.ayahService.getSuraIndexes()
      .subscribe(
        _data => this.suraIndexes = _data,
        error => this.errorMsg = <any>error,
        () => {
          // console.log(this.suraIndexes)
        }
      )
  }

  toggleHideVerses() {
    this.hideVerses = !this.hideVerses
    this.storeFormData()
  }

  openNav() {
    document.getElementById("mySidenav").style.width = "100%";
  }

  /* Set the width of the side navigation to 0 */
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

  // ********************** This code below is to remove tashkeel from Quranic letters- keep it for reference *******************
  removeTashkeel2(orgTxt) {
    var noTashkel = orgTxt.replace(/([^\u0621-\u064A\u0660-\u0669\u066E-\u06D5\u06EE\u06EF\u06FA-\u06FC\u06FF\u06F9a-zA-Z 0-9])/g, '');
    return noTashkel
  }
  // ************************************************************






  // handleLookup(suraId: number) { //, verseId: number
  //   this.selectedSura = suraId
  //   console.log(suraId);

  //   this.ayat = this.ayat.filter(s => s.suraId === this.selectedSura)//s.verseId === verseId &&
  //   if (suraId.toString().trim() == '') {
  //     this.getAyat();
  //   }
  // }

}
