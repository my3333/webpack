import { centToYuan, yuanToCent} from './index.js';


const yuan = 56;

const c = yuanToCent(yuan);
const y = centToYuan(c);

console.log('元转分=',c, '分转元=', y);
