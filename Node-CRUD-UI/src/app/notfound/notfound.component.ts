import { Component } from '@angular/core';

@Component({
  selector: 'app-notfound',
  template: `
  <div class="surface-section px-4 py-8 md:px-6 lg:px-8">
    <div class="flex flex-column lg:flex-row justify-content-center align-items-center gap-7">
        <div class="text-center lg:text-right">
            <div class="mt-6 mb-3 font-bold text-6xl text-900">Are you lost?
            </div>
            <p class="text-700 text-3xl mt-0 mb-6">Sorry, we couldn't find the page.</p>
            <button pbutton="" routerLink="/home" type="button" label="Go back to home page"
                class="p-element p-button-outlined p-button p-component">
                <span class="p-button-label">Go back to home page
                </span>
            </button>
        </div>
        <div>
            <img src="assets/images/404-rocket.png" alt="Image" class="w-full md:w-28rem">
        </div>
    </div>
</div>
  `,
  styles: [
  ]
})
export class NotfoundComponent {

}
