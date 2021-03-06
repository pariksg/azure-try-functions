export type ResourceId = string;

export interface ArmObj<T> {
    id: string;
    name: string;
    type: string;
    kind: string;
    location: string;
    properties: T;
    identity?: Identity;
}

export interface ArmObjMap {
    objects: { [key: string]: ArmObj<any> };
    error?: string;
}

export interface ArmArrayResult<T> {
    value: ArmObj<T>[];
    nextLink: string;
}

export interface Identity {
    principalId: string;
    tenantId: string;
    type: string;
}