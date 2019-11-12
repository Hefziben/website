import { GuestCheckoutModule } from './guest-checkout.module';

describe('GuestCheckoutModule', () => {
  let guestCheckoutModule: GuestCheckoutModule;

  beforeEach(() => {
    guestCheckoutModule = new GuestCheckoutModule();
  });

  it('should create an instance', () => {
    expect(guestCheckoutModule).toBeTruthy();
  });
});
