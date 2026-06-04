import { Type, applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { CommonResponseDto } from '../dto/common.dto';

interface Prop {
    [key: string]: any;
}

/**
 * @description: 生成返回结果装饰器
 * 该装饰器现在只接收一个数据类型 `data`
 */
export const ApiResult = <TModel extends Type<any>>({
    type,
    status = HttpStatus.OK, // 默认为 200 OK
}: {
    type: TModel | TModel[] | null;
    status?: HttpStatus;
}) => {
    let prop: Prop | null = null;

    const model = Array.isArray(type) ? type[0] : type;

    if (Array.isArray(type)) {
        prop = {
            type: 'array',
            items: { $ref: getSchemaPath(type[0]) },
        };
    } else if (type) {
        prop = { $ref: getSchemaPath(type) };
    } else {
        prop = { type: 'null', default: null };
    }

    return applyDecorators(
        model ? ApiExtraModels(model) : ApiExtraModels(),
        ApiResponse({
            status,
            schema: {
                allOf: [
                    { $ref: getSchemaPath(CommonResponseDto) },
                    {
                        properties: {
                            code: {
                                type: 'integer',
                                example: status, // 默认是 HTTP 状态码
                            },
                            message: {
                                type: 'string',
                                example: [
                                    HttpStatus.OK,
                                    HttpStatus.CREATED,
                                ].includes(status)
                                    ? 'Ok'
                                    : 'Error',
                            },
                            data: prop,
                        },
                    },
                ],
            },
        }),
    );
};
