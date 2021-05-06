mkdir ./dist/esm
cat >dist/esm/index.js <<!EOF
import cjsModule from '../index.js';
export const Ed25519Signature2020 = cjsModule.Ed25519Signature2020;
export const suiteContext = cjsModule.suiteContext;
!EOF

cat >dist/esm/package.json <<!EOF
{
  "type": "module"
}
!EOF
