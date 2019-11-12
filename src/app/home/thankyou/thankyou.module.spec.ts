import { ThankyouModule } from './thankyou.module';

describe('ThankyouModule', () => {
  let thankyouModule: ThankyouModule;

  beforeEach(() => {
    thankyouModule = new ThankyouModule();
  });

  it('should create an instance', () => {
    expect(thankyouModule).toBeTruthy();
  });
});
