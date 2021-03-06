import { assert } from 'chai';

import { IObfuscationResult } from '../../../../../src/interfaces/IObfuscationResult';

import { StringArrayEncoding } from '../../../../../src/enums/StringArrayEncoding';

import { NO_CUSTOM_NODES_PRESET } from '../../../../../src/options/presets/NoCustomNodes';

import { readFileAsString } from '../../../../helpers/readFileAsString';

import { JavaScriptObfuscator } from '../../../../../src/JavaScriptObfuscatorFacade';

describe('LiteralTransformer', () => {
    describe('transformation of literal node with string value', () => {
        describe('variant #1: default behaviour', () => {
            const stringArrayRegExp: RegExp = /^var *_0x([a-f0-9]){4} *= *\['test'\];/;
            const stringArrayCallRegExp: RegExp = /var *test *= *_0x([a-f0-9]){4}\('0x0'\);/;

            let obfuscatedCode: string;

            before(() => {
                const code: string = readFileAsString(__dirname + '/fixtures/simple-input.js');
                const obfuscationResult: IObfuscationResult = JavaScriptObfuscator.obfuscate(
                    code,
                    {
                        ...NO_CUSTOM_NODES_PRESET,
                        stringArray: true,
                        stringArrayThreshold: 1
                    }
                );

                obfuscatedCode = obfuscationResult.getObfuscatedCode();
            });

            it('match #1: should replace literal node value with value from string array', () => {
                assert.match(obfuscatedCode, stringArrayRegExp);
            });

            it('match #2: should replace literal node value with value from string array', () => {
                assert.match(obfuscatedCode, stringArrayCallRegExp);
            });
        });

        describe('variant #2: `stringArray` option is disabled', () => {
            const regExp: RegExp = /^var *test *= *'test';/;

            let obfuscatedCode: string;

            before(() => {
                const code: string = readFileAsString(__dirname + '/fixtures/simple-input.js');
                const obfuscationResult: IObfuscationResult = JavaScriptObfuscator.obfuscate(
                    code,
                    {
                        ...NO_CUSTOM_NODES_PRESET
                    }
                );

                obfuscatedCode = obfuscationResult.getObfuscatedCode();
            });

            it('shouldn\'t replace literal node value with value from string array', () => {
                assert.match(obfuscatedCode, regExp);
            });
        });

        describe('variant #3: string contains non-latin and non-digit characters and `unicodeEscapeSequence` is disabled', () => {
            let testFunc: () => void;

            before(() => {
                const code: string = readFileAsString(__dirname + '/fixtures/error-when-non-latin.js');

                testFunc = () => JavaScriptObfuscator.obfuscate(
                    code,
                    {
                        ...NO_CUSTOM_NODES_PRESET,
                        stringArray: true,
                        stringArrayThreshold: 1
                    }
                );
            });

            it('should\'t throw an error', () => {
                assert.doesNotThrow(testFunc);
            });
        });

        describe('variant #4: same literal node values', () => {
            const stringArrayRegExp: RegExp = /^var *_0x([a-f0-9]){4} *= *\['test'\];/;
            const stringArrayCallRegExp: RegExp = /var *test *= *_0x([a-f0-9]){4}\('0x0'\);/;

            let obfuscatedCode: string;

            before(() => {
                const code: string = readFileAsString(__dirname + '/fixtures/same-literal-values.js');
                const obfuscationResult: IObfuscationResult = JavaScriptObfuscator.obfuscate(
                    code,
                    {
                        ...NO_CUSTOM_NODES_PRESET,
                        stringArray: true,
                        stringArrayThreshold: 1
                    }
                );

                obfuscatedCode = obfuscationResult.getObfuscatedCode();
            });

            it('match #1: should create only one item in string array for same literal node values', () => {
                assert.match(obfuscatedCode, stringArrayRegExp);
            });

            it('match #2: should create only one item in string array for same literal node values', () => {
                assert.match(obfuscatedCode, stringArrayCallRegExp);
            });
        });

        describe('variant #5: `unicodeEscapeSequence` option is enabled', () => {
            const regExp: RegExp = /^var *test *= *'\\x74\\x65\\x73\\x74';$/;

            let obfuscatedCode: string;

            before(() => {
                const code: string = readFileAsString(__dirname + '/fixtures/simple-input.js');
                const obfuscationResult: IObfuscationResult = JavaScriptObfuscator.obfuscate(
                    code,
                    {
                        ...NO_CUSTOM_NODES_PRESET,
                        unicodeEscapeSequence: true

                    }
                );

                obfuscatedCode = obfuscationResult.getObfuscatedCode();
            });

            it('should replace literal node value with unicode escape sequence', () => {
                assert.match(obfuscatedCode, regExp);
            });
        });

        describe('variant #6: `unicodeEscapeSequence` and `stringArray` options are enabled', () => {
            const stringArrayRegExp: RegExp = /^var *_0x([a-f0-9]){4} *= *\['\\x74\\x65\\x73\\x74'\];/;
            const stringArrayCallRegExp: RegExp = /var *test *= *_0x([a-f0-9]){4}\('0x0'\);/;

            let obfuscatedCode: string;

            before(() => {
                const code: string = readFileAsString(__dirname + '/fixtures/simple-input.js');
                const obfuscationResult: IObfuscationResult = JavaScriptObfuscator.obfuscate(
                    code,
                    {
                        ...NO_CUSTOM_NODES_PRESET,
                        stringArray: true,
                        stringArrayThreshold: 1,
                        unicodeEscapeSequence: true
                    }
                );

                obfuscatedCode = obfuscationResult.getObfuscatedCode();
            });

            it('match #1: should replace literal node value with unicode escape sequence from string array', () => {
                assert.match(obfuscatedCode, stringArrayRegExp);
            });

            it('match #1: should replace literal node value with unicode escape sequence from string array', () => {
                assert.match(obfuscatedCode, stringArrayCallRegExp);
            });
        });

        describe('variant #7: short literal node value', () => {
            const regExp: RegExp = /var *test *= *'te';/;

            let obfuscatedCode: string;

            before(() => {
                const code: string = readFileAsString(__dirname + '/fixtures/short-literal-value.js');
                const obfuscationResult: IObfuscationResult = JavaScriptObfuscator.obfuscate(
                    code,
                    {
                        ...NO_CUSTOM_NODES_PRESET,
                        stringArray: true,
                        stringArrayThreshold: 1
                    }
                );

                obfuscatedCode = obfuscationResult.getObfuscatedCode();
            });

            it('shouldn\'t replace short literal node value with value from string array', () => {
                assert.match(obfuscatedCode, regExp);
            });
        });

        describe('variant #8: base64 encoding', () => {
            const stringArrayRegExp: RegExp = /^var *_0x([a-f0-9]){4} *= *\['dGVzdA=='\];/;
            const stringArrayCallRegExp: RegExp = /var *test *= *_0x([a-f0-9]){4}\('0x0'\);/;

            let obfuscatedCode: string;

            before(() => {
                const code: string = readFileAsString(__dirname + '/fixtures/simple-input.js');
                const obfuscationResult: IObfuscationResult = JavaScriptObfuscator.obfuscate(
                    code,
                    {
                        ...NO_CUSTOM_NODES_PRESET,
                        stringArray: true,
                        stringArrayEncoding: StringArrayEncoding.Base64,
                        stringArrayThreshold: 1
                    }
                );

                obfuscatedCode = obfuscationResult.getObfuscatedCode();
            });

            it('match #1: should replace literal node value with value from string array encoded using base64', () => {
                assert.match(obfuscatedCode, stringArrayRegExp);
            });

            it('match #2: should replace literal node value with value from string array encoded using base64', () => {
                assert.match(obfuscatedCode, stringArrayCallRegExp);
            });
        });

        describe('variant #9: rc4 encoding', () => {
            const regExp: RegExp = /var *test *= *_0x([a-f0-9]){4}\('0x0', *'.{4}'\);/;

            let obfuscatedCode: string;

            before(() => {
                const code: string = readFileAsString(__dirname + '/fixtures/simple-input.js');
                const obfuscationResult: IObfuscationResult = JavaScriptObfuscator.obfuscate(
                    code,
                    {
                        ...NO_CUSTOM_NODES_PRESET,
                        stringArray: true,
                        stringArrayEncoding: StringArrayEncoding.Rc4,
                        stringArrayThreshold: 1
                    }
                );

                obfuscatedCode = obfuscationResult.getObfuscatedCode();
            });

            it('should replace literal node value with value from string array encoded using rc4', () => {
                assert.match(obfuscatedCode, regExp);
            });
        });

        describe('variant #10: `stringArrayThreshold` option value', () => {
            const samples: number = 1000;
            const stringArrayThreshold: number = 0.5;
            const delta: number = 0.1;

            const regExp1: RegExp = /var *test *= *_0x([a-f0-9]){4}\('0x0'\);/g;
            const regExp2: RegExp = /var *test *= *'test';/g;

            let stringArrayProbability: number,
                noStringArrayProbability: number;

            before(() => {
                const code: string = readFileAsString(__dirname + '/fixtures/simple-input.js');
                const obfuscationResult: IObfuscationResult = JavaScriptObfuscator.obfuscate(
                    `${code}\n`.repeat(samples),
                    {
                        ...NO_CUSTOM_NODES_PRESET,
                        stringArray: true,
                        stringArrayThreshold: stringArrayThreshold
                    }
                );

                const stringArrayMatchesLength: number = obfuscationResult
                    .getObfuscatedCode()
                    .match(regExp1)!
                    .length;
                const noStringArrayMatchesLength: number = obfuscationResult
                    .getObfuscatedCode()
                    .match(regExp2)!
                    .length;

                stringArrayProbability = stringArrayMatchesLength / samples;
                noStringArrayProbability = noStringArrayMatchesLength / samples;
            });

            it('variant #1: should replace literal node value with value from string array with `stringArrayThreshold` chance', () => {
                assert.closeTo(stringArrayProbability, stringArrayThreshold, delta);
            });

            it('variant #2: shouldn\'t replace literal node value with value from string array with `(1 - stringArrayThreshold)` chance', () => {
                assert.closeTo(noStringArrayProbability, stringArrayThreshold, delta);
            });
        });
    });

    describe('transformation of literal node with boolean value', () => {
        const regExp: RegExp = /^var *test *= *!!\[\];$/;

        let obfuscatedCode: string;

        before(() => {
            const code: string = readFileAsString(__dirname + '/fixtures/boolean-value.js');
            const obfuscationResult: IObfuscationResult = JavaScriptObfuscator.obfuscate(
                code,
                {
                    ...NO_CUSTOM_NODES_PRESET,
                    stringArray: true,
                    stringArrayThreshold: 1
                }
            );

            obfuscatedCode = obfuscationResult.getObfuscatedCode();
        });

        it('should transform literal node', () => {
            assert.match(obfuscatedCode, regExp);
        });
    });

    describe('transformation of literal node with number value', () => {
        const regExp: RegExp = /^var *test *= *0x0;$/;

        let obfuscatedCode: string;

        before(() => {
            const code: string = readFileAsString(__dirname + '/fixtures/number-value.js');
            const obfuscationResult: IObfuscationResult = JavaScriptObfuscator.obfuscate(
                code,
                {
                    ...NO_CUSTOM_NODES_PRESET,
                    stringArray: true,
                    stringArrayThreshold: 1
                }
            );

            obfuscatedCode = obfuscationResult.getObfuscatedCode();
        });

        it('should transform literal node', () => {
            assert.match(obfuscatedCode, regExp);
        });
    });

    describe('RegExp literal', () => {
        const regExp: RegExp = /^var *regExp *= *\/\(\\d\+\)\/;$/;

        let obfuscatedCode: string;

        before(() => {
            const code: string = readFileAsString(__dirname + '/fixtures/regexp-literal.js');
            const obfuscationResult: IObfuscationResult = JavaScriptObfuscator.obfuscate(
                code,
                {
                    ...NO_CUSTOM_NODES_PRESET,
                    stringArray: true,
                    stringArrayThreshold: 1
                }
            );

            obfuscatedCode = obfuscationResult.getObfuscatedCode();
        });

        it('should keep safe value of RegExp literal', () => {
            assert.match(obfuscatedCode, regExp);
        });
    });
});
