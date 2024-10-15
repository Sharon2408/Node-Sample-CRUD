import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
   <div class="surface-section px-4 py-6 md:px-6 lg:px-8 text-center"><img
        src="assets/images/hyper-300.svg" alt="Image" height="50">
    <div class="font-medium text-900 mt-4 mb-3">© 2023 Bastion, Inc</div>
    <p class="text-600 line-height-3 mt-0 mb-4">Cursus metus aliquam eleifend mi. Malesuada pellentesque elit eget
        gravida. Nunc eget lorem dolor sed viverra ipsum nunc aliquet bibendum. Massa tincidunt dui ut ornare lectus sit
        amet est placerat.</p>
    <div class="flex align-items-center justify-content-center"><a class="cursor-pointer text-700 mr-5"><i
                class="pi pi-twitter"></i></a><a class="cursor-pointer text-700 mr-5"><i
                class="pi pi-facebook"></i></a><a class="cursor-pointer text-700"><i class="pi pi-github"></i></a></div>
</div>
  `,
  styles: [
  ]
})
export class FooterComponent {

}
