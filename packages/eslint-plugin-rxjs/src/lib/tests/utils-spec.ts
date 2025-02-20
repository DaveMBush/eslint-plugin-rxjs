import { expect } from 'chai';
import decamelize from 'decamelize';
import { createRegExpForWords } from '../source/utils';

describe('utils', () => {
  describe('createRegExpForWords', () => {
    const regExp = createRegExpForWords(['add']) as RegExp;

    it('should match action literals', () => {
      expect(`"ADD"`).to.match(regExp);
      expect(`"ADD_SOMETHING"`).to.match(regExp);
      expect(`"SOMETHING_ADD"`).to.match(regExp);

      expect(`'ADD'`).to.match(regExp);
      expect(`'ADD_SOMETHING'`).to.match(regExp);
      expect(`'SOMETHING_ADD'`).to.match(regExp);

      expect('`ADD`').to.match(regExp);
      expect('`ADD_SOMETHING`').to.match(regExp);
      expect('`SOMETHING_ADD`').to.match(regExp);
    });

    it('should match action symbols', () => {
      expect('ADD').to.match(regExp);
      expect('ADD_SOMETHING').to.match(regExp);
      expect('SOMETHING_ADD').to.match(regExp);

      expect(decamelize('Add')).to.match(regExp);
      expect(decamelize('AddSomething')).to.match(regExp);
      expect(decamelize('SomethingAdd')).to.match(regExp);
    });

    it('should not match words within larger words', () => {
      expect('READD').to.not.match(regExp);
      expect('Readd').to.not.match(regExp);

      expect('ADDER').to.not.match(regExp);
      expect('Adder').to.not.match(regExp);

      expect('LADDER').to.not.match(regExp);
      expect('Ladder').to.not.match(regExp);
    });

    it('should create a RegExp from a string', () => {
      expect((createRegExpForWords('.') as RegExp).toString()).to.equal('/./i');
    });
  });
});
