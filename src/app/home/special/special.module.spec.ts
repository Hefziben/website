import { SpecialModule } from './special.module';

describe('SpecialModule', () => {
  let specialModule: SpecialModule;

  beforeEach(() => {
    specialModule = new SpecialModule();
  });

  it('should create an instance', () => {
    expect(specialModule).toBeTruthy();
  });
});
