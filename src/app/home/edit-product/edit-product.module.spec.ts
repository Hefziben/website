import { EditProductModule } from './edit-product.module';

describe('EditProductModule', () => {
  let editProductModule: EditProductModule;

  beforeEach(() => {
    editProductModule = new EditProductModule();
  });

  it('should create an instance', () => {
    expect(editProductModule).toBeTruthy();
  });
});
