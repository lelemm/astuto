import {
  TenantUpdateActionTypes,
  TENANT_UPDATE_START,
  TENANT_UPDATE_SUCCESS,
  TENANT_UPDATE_FAILURE,
} from '../actions/Tenant/updateTenant';

import ITenantJSON from '../interfaces/json/ITenant';

export interface TenantState {
  data: ITenantJSON | null;
  isUpdating: boolean;
  error: string;
}

const initialState: TenantState = {
  data: null,
  isUpdating: false,
  error: '',
};

const tenantReducer = (
  state = initialState,
  action: TenantUpdateActionTypes,
): TenantState => {
  switch (action.type) {
    case TENANT_UPDATE_START:
      return {
        ...state,
        isUpdating: true,
        error: '',
      };

    case TENANT_UPDATE_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        data: action.tenant,
        error: '',
      };

    case TENANT_UPDATE_FAILURE:
      return {
        ...state,
        isUpdating: false,
        error: action.error,
      };

    default:
      return state;
  }
};

export default tenantReducer;