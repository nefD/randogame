import { map } from 'rxjs/operators';
import { createAction } from '@reduxjs/toolkit';

export const select = <T,R>(selector: (value: T) => R) => map((state: T) => selector(state));

export const NullAction = createAction('utilities/nullAction');
