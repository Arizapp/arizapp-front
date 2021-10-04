
export type CreateInfoProps = {
    info_label: string;
    info_key: string | number;
    info_type?: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | undefined;
    info_value: Array<any> | Record<string, any> | string | number;
    info_secret?: string;
};
export type CreateInfoResponseType = {
    success: boolean;
    msg: string;
    insert_id?: number | string;
};
export async function createInfo(createInfoProps: CreateInfoProps): Promise<CreateInfoResponseType> {
    var response: CreateInfoResponseType = {
        success: false,
        msg: '',
        insert_id: 0,
    };
    createInfoProps.info_secret = "398b03ca7d745be9bfbbd9367a246bd05562b78f";
    createInfoProps.info_type = (createInfoProps?.info_type ? createInfoProps.info_type : (typeof createInfoProps.info_value));
    if (typeof createInfoProps.info_value === 'object') {

        try {
            createInfoProps.info_value = JSON.stringify(createInfoProps.info_value);
        } catch (e: any) {

        }
    }
    try {
        return new Promise<CreateInfoResponseType>((resolve, reject) => {
            var promiseTimeout = setTimeout(() => {
                response.msg = "Create info timeout.";
                resolve(response);
            }, 8000);
            Z.ajax({
                method: 'POST',
                url: 'http://localhost:8181/VerticalAuxiliarInfo/user/api/insert/',
                with_credentials: true,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                data: createInfoProps,
                success: function (createInfoData: CreateInfoResponseType) {
                    clearTimeout(promiseTimeout);
                    resolve(createInfoData);
                },
                error: function (response) {
                    clearTimeout(promiseTimeout);
                    var data = (response?.responseJSON || response);
                    console.log('Login error response: ', data);
                    resolve({
                        success: false,
                        msg: data?.msg || 'unknow error message.',
                        insert_id: 0
                    });
                }
            });
        });
    } catch (e: any) {
        return response;
    }
}
export type getInfoProps = {
    info_label: string;
    info_key: string;
    info_secret?: string;
};
export type getInfoResponseType = Array<{
    id?: number | string;
    label: string;
    info_key: string;
    info_value: any;
    data_type: "object" | "string" | "boolean" | undefined;
    create_time?: string;
    update_time?: string;
}>;
export async function getInfo(createInfoProps: getInfoProps): Promise<getInfoResponseType> {
    var response: getInfoResponseType = [];
    createInfoProps.info_secret = "398b03ca7d745be9bfbbd9367a246bd05562b78f";
    try {
        return new Promise<getInfoResponseType>((resolve, reject) => {
            var promiseTimeout = setTimeout(() => {
                resolve([]);
            }, 8000);
            Z.ajax({
                method: 'POST',
                url: 'http://localhost:8181/VerticalAuxiliarInfo/user/api/getInfo/',
                with_credentials: true,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                data: createInfoProps,
                success: function (getInfoData: getInfoResponseType) {
                    clearTimeout(promiseTimeout);
                    resolve(getInfoData);
                },
                error: function (response) {
                    clearTimeout(promiseTimeout);
                    var data = (response?.responseJSON || response);
                    console.log('Login error response: ', data);
                    resolve([]);
                }
            });
        });
    } catch (e: any) {
        return response;
    }
}