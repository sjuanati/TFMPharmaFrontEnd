import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { Order, Pharmacy } from '../../shared/Interfaces';

export interface RootState {
  order: Order,
  pharmacy: Pharmacy,
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
