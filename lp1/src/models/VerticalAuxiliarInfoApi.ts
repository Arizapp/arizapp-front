
export type CreateInfoProps = {
    info_label: string;
    info_key: string;
    info_type: "object" | "string";
    info_value: Array<any> | Record<string, any> | string;
    info_secret: string;
};
export type CreateInfoResponseType = {
    success: boolean;
    msg: string;
    insert_id: number | string;
};
export async function createInfo(createInfoProps: CreateInfoProps): Promise<CreateInfoResponseType> {
    var response: CreateInfoResponseType = {
        success: false,
        msg: '',
        insert_id: 0,
    };
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