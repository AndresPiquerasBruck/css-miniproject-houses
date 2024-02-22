import { animate } from '@angular/animations';
import { Component, Renderer2, OnInit, OnDestroy, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  initialPosX: number = 0;
  moving: boolean = false;
  lastPercentage: number = 0; // New property to store the last translated percentage
  newPercentage: number = 0;
  selectedIndex: number = 0;

  imagesData: any[] = [
    {src: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", expanded: false},
    {src: "https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", expanded: false},
    {src: "https://images.pexels.com/photos/383568/pexels-photo-383568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", expanded: false},
    {src: "https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", expanded: false},
    {src: "https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", expanded: false},
    {src: "https://images.pexels.com/photos/2736139/pexels-photo-2736139.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", expanded: false},
    {src: "https://images.pexels.com/photos/2082090/pexels-photo-2082090.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", expanded: false},
    {src: "https://images.pexels.com/photos/68389/pexels-photo-68389.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", expanded: false},
    {src: "https://images.pexels.com/photos/5997967/pexels-photo-5997967.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", expanded: false},
    {src: "https://images.pexels.com/photos/6707628/pexels-photo-6707628.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", expanded: false}
  ]

  private globalClientListener: { [key: string]: () => void } = {};

  @ViewChild('imageTrack', { static: false }) track: ElementRef | undefined;
  @ViewChildren('image') imagesList: QueryList<any> | undefined;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  animateTrack(value: number, duration: number){
    if (this.track) {
      if (this.newPercentage + value > 0 ) { this.newPercentage = 0; }
      else if (this.newPercentage + value < -100 ) { this.newPercentage = -100; }
      else { this.newPercentage = this.newPercentage + value }
      this.track.nativeElement.animate([
        { transform: `translate(${this.newPercentage}%, -50%)` }
      ], { 
        duration: duration, 
        fill: "forwards" 
      });
    }
  }

  animateImages(value: number, duration: number) {
    if (this.imagesList) {
      if (this.newPercentage + value > 0 ) { this.newPercentage = 0; }
      else if (this.newPercentage + value < -100 ) { this.newPercentage = -100; }
      else { this.newPercentage = this.newPercentage + value }
      this.imagesList.forEach(image => {
        image.nativeElement.animate([
          { objectPosition: `${this.newPercentage + 100}% 50%` }
        ], { 
          duration: duration, 
          fill: "forwards"
        });
      });
    }
  }

  ngOnInit() {
    this.globalClientListener["mousedown"] = (this.renderer.listen('window', 'mousedown', (e: MouseEvent) => {
      this.initialPosX = e.clientX;
      this.moving = true;
    }));

    this.globalClientListener["mousemove"] = this.renderer.listen('window', 'mousemove', (e: MouseEvent) => {
      if (!this.moving) return;

      const maxDelta = window.innerWidth / 2;
      let mouseDelta = e.clientX - this.initialPosX;
      let movementPercentage = (mouseDelta / maxDelta) * 100;
      this.newPercentage = this.lastPercentage + movementPercentage;

      if (this.newPercentage > 0) { 
        this.newPercentage = 0; 
      } else if (this.newPercentage < -100) {
        this.newPercentage = -100;
      }

      this.animateTrack(0, 1200)
      this.animateImages(0, 1200);
    });

    this.globalClientListener["mouseup"] =  this.renderer.listen('window', 'mouseup', (e: MouseEvent) => {
      const mouseDelta = e.clientX - this.initialPosX;
      const maxDelta = window.innerWidth / 2;
      this.lastPercentage += (mouseDelta / maxDelta) * 100; // Update the lastPercentage on mouse up

      if (this.lastPercentage > 0) {
        this.lastPercentage = 0;
      } else if (this.lastPercentage < -100) {
        this.lastPercentage = -100;
      }      

      this.moving = false;
    });
  }

  clickImage(index:number) {
    if (this.imagesList) {
      this.imagesList.forEach((image, i) => {
        if (i !== index && this.imagesList) {
          image.expanded = false;
        } else if (this.imagesList) {
          image.expanded = true;
        }
      });

      this.imagesList.forEach((image, i) => {
        if (this.imagesList && image.expanded) {
          image.nativeElement.animate([
            { width: `100vh` }
          ], { 
            duration: 1000, 
            fill: "forwards"
          });
        } else {
          image.nativeElement.animate([
            { width: `40vmin` }
          ], { 
            duration: 1000, 
            fill: "forwards"
          });
        }
      });
    }
  }

  trackHandleKeys(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' || event.key === 'Left') {
      console.log("left");
      event.preventDefault();
      this.animateTrack(11.1111, 400);
      this.animateImages(0, 400);
      if (this.selectedIndex > 0 && this.imagesList) { 
        this.selectedIndex = this.selectedIndex - 1; 
        this.imagesList.toArray()[this.selectedIndex].nativeElement.focus();
      }
    } else if (event.key === 'ArrowRight' || event.key === 'Right') {
      event.preventDefault();
      this.animateTrack(-11.1111, 400);
      this.animateImages(0, 400);
      if (this.selectedIndex < 9 && this.imagesList) { 
        this.selectedIndex = this.selectedIndex + 1; 
        this.imagesList.toArray()[this.selectedIndex].nativeElement.focus();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.globalClientListener) {
      Object.values(this.globalClientListener).forEach(removeFn => removeFn());
    }
  }
}
