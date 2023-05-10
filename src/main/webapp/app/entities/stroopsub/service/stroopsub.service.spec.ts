import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStroopsub } from '../stroopsub.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../stroopsub.test-samples';

import { StroopsubService } from './stroopsub.service';

const requireRestSample: IStroopsub = {
  ...sampleWithRequiredData,
};

describe('Stroopsub Service', () => {
  let service: StroopsubService;
  let httpMock: HttpTestingController;
  let expectedResult: IStroopsub | IStroopsub[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StroopsubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Stroopsub', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const stroopsub = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(stroopsub).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Stroopsub', () => {
      const stroopsub = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(stroopsub).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Stroopsub', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Stroopsub', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Stroopsub', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addStroopsubToCollectionIfMissing', () => {
      it('should add a Stroopsub to an empty array', () => {
        const stroopsub: IStroopsub = sampleWithRequiredData;
        expectedResult = service.addStroopsubToCollectionIfMissing([], stroopsub);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stroopsub);
      });

      it('should not add a Stroopsub to an array that contains it', () => {
        const stroopsub: IStroopsub = sampleWithRequiredData;
        const stroopsubCollection: IStroopsub[] = [
          {
            ...stroopsub,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStroopsubToCollectionIfMissing(stroopsubCollection, stroopsub);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Stroopsub to an array that doesn't contain it", () => {
        const stroopsub: IStroopsub = sampleWithRequiredData;
        const stroopsubCollection: IStroopsub[] = [sampleWithPartialData];
        expectedResult = service.addStroopsubToCollectionIfMissing(stroopsubCollection, stroopsub);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stroopsub);
      });

      it('should add only unique Stroopsub to an array', () => {
        const stroopsubArray: IStroopsub[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const stroopsubCollection: IStroopsub[] = [sampleWithRequiredData];
        expectedResult = service.addStroopsubToCollectionIfMissing(stroopsubCollection, ...stroopsubArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const stroopsub: IStroopsub = sampleWithRequiredData;
        const stroopsub2: IStroopsub = sampleWithPartialData;
        expectedResult = service.addStroopsubToCollectionIfMissing([], stroopsub, stroopsub2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stroopsub);
        expect(expectedResult).toContain(stroopsub2);
      });

      it('should accept null and undefined values', () => {
        const stroopsub: IStroopsub = sampleWithRequiredData;
        expectedResult = service.addStroopsubToCollectionIfMissing([], null, stroopsub, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stroopsub);
      });

      it('should return initial array if no Stroopsub is added', () => {
        const stroopsubCollection: IStroopsub[] = [sampleWithRequiredData];
        expectedResult = service.addStroopsubToCollectionIfMissing(stroopsubCollection, undefined, null);
        expect(expectedResult).toEqual(stroopsubCollection);
      });
    });

    describe('compareStroopsub', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStroopsub(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareStroopsub(entity1, entity2);
        const compareResult2 = service.compareStroopsub(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareStroopsub(entity1, entity2);
        const compareResult2 = service.compareStroopsub(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareStroopsub(entity1, entity2);
        const compareResult2 = service.compareStroopsub(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
