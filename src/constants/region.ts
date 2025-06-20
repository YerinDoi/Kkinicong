const regionData: Record<
  string,
  Record<string, { name: string; lat: number; lng: number }[]>
> = {
  인천광역시: {
    중구: [
      {
        name: '중앙동1가',
        lat: 37.473456950287,
        lng: 126.62045590671336,
      },
      {
        name: '중앙동2가',
        lat: 37.472791688198,
        lng: 126.62173476881706,
      },
      {
        name: '중앙동3가',
        lat: 37.47199802459204,
        lng: 126.62287709866598,
      },
      {
        name: '중앙동4가',
        lat: 37.47130705246456,
        lng: 126.62410528916662,
      },
      {
        name: '해안동1가',
        lat: 37.47284514997832,
        lng: 126.61994632792944,
      },
      {
        name: '해안동2가',
        lat: 37.47217591019994,
        lng: 126.621187042809,
      },
      {
        name: '해안동3가',
        lat: 37.471356668429856,
        lng: 126.62229736909646,
      },
      {
        name: '해안동4가',
        lat: 37.47066475465391,
        lng: 126.62350063274712,
      },
      {
        name: '관동1가',
        lat: 37.47369875430998,
        lng: 126.6215768057128,
      },
      {
        name: '관동2가',
        lat: 37.47274309517421,
        lng: 126.62352225130395,
      },
      {
        name: '관동3가',
        lat: 37.47206048033876,
        lng: 126.62477683833306,
      },
      {
        name: '항동1가',
        lat: 37.47390094735666,
        lng: 126.61676752407108,
      },
      {
        name: '항동2가',
        lat: 37.47243381348001,
        lng: 126.61762198882316,
      },
      {
        name: '항동3가',
        lat: 37.47205595403593,
        lng: 126.61936004049814,
      },
      {
        name: '항동4가',
        lat: 37.47140371474936,
        lng: 126.62051226907371,
      },
      {
        name: '항동5가',
        lat: 37.47071161367349,
        lng: 126.6217200895934,
      },
      {
        name: '항동6가',
        lat: 37.47003437155273,
        lng: 126.62289326418176,
      },
      {
        name: '항동7가',
        lat: 37.452579559934,
        lng: 126.61261030819604,
      },
      {
        name: '송학동1가',
        lat: 37.47462793381722,
        lng: 126.62246379920477,
      },
      {
        name: '송학동2가',
        lat: 37.473953957836265,
        lng: 126.62462666771384,
      },
      {
        name: '송학동3가',
        lat: 37.473438242185495,
        lng: 126.6259819350296,
      },
      {
        name: '사동',
        lat: 37.468781194918215,
        lng: 126.62553801383638,
      },
      {
        name: '신생동',
        lat: 37.467086437561605,
        lng: 126.62802876987814,
      },
      {
        name: '신포동',
        lat: 37.471079278180376,
        lng: 126.62668282446953,
      },
      {
        name: '답동',
        lat: 37.46980426769681,
        lng: 126.62923000053348,
      },
      {
        name: '신흥동1가',
        lat: 37.466993303293535,
        lng: 126.63143130397586,
      },
      {
        name: '신흥동2가',
        lat: 37.46625031492894,
        lng: 126.63388235263837,
      },
      {
        name: '신흥동3가',
        lat: 37.44290380664079,
        lng: 126.6261724834074,
      },
      {
        name: '선화동',
        lat: 37.465668620472165,
        lng: 126.63729842707228,
      },
      {
        name: '유동',
        lat: 37.46974378751218,
        lng: 126.6369884067266,
      },
      {
        name: '율목동',
        lat: 37.47028162240483,
        lng: 126.63382933501786,
      },
      {
        name: '도원동',
        lat: 37.467096592385744,
        lng: 126.64020233207144,
      },
      {
        name: '내동',
        lat: 37.4734030476234,
        lng: 126.62785748404562,
      },
      {
        name: '경동',
        lat: 37.47212075642496,
        lng: 126.632857116118,
      },
      {
        name: '용동',
        lat: 37.47319864871864,
        lng: 126.63121561825128,
      },
      {
        name: '인현동',
        lat: 37.47494061989942,
        lng: 126.63142205006802,
      },
      {
        name: '전동',
        lat: 37.47719911522117,
        lng: 126.62622205412768,
      },
      {
        name: '북성동1가',
        lat: 37.47342226894578,
        lng: 126.60520619568312,
      },
      {
        name: '북성동2가',
        lat: 37.47664922293626,
        lng: 126.61831064549332,
      },
      {
        name: '북성동3가',
        lat: 37.47612080752535,
        lng: 126.62068973123118,
      },
      {
        name: '선린동',
        lat: 37.47455292925525,
        lng: 126.61823271028798,
      },
      {
        name: '송월동1가',
        lat: 37.48002317772813,
        lng: 126.6233563555348,
      },
      {
        name: '송월동2가',
        lat: 37.479153397354175,
        lng: 126.61941758243546,
      },
      {
        name: '송월동3가',
        lat: 37.4780638653682,
        lng: 126.62107856378132,
      },
      {
        name: '중산동',
        lat: 37.50786661488528,
        lng: 126.56146748385034,
      },
      {
        name: '운남동',
        lat: 37.48471013977805,
        lng: 126.5295307898966,
      },
      {
        name: '운서동',
        lat: 37.46950348089599,
        lng: 126.45097587180516,
      },
      {
        name: '운북동',
        lat: 37.51472799672906,
        lng: 126.5172226387468,
      },
      {
        name: '을왕동',
        lat: 37.455196707297205,
        lng: 126.37926291996835,
      },
      {
        name: '남북동',
        lat: 37.44984690052599,
        lng: 126.4137414389572,
      },
      {
        name: '덕교동',
        lat: 37.43517622673761,
        lng: 126.4198718962426,
      },
      {
        name: '무의동',
        lat: 37.38653328573411,
        lng: 126.41952937626036,
      },
    ],
    동구: [
      {
        name: '만석동',
        lat: 37.48621294699751,
        lng: 126.6207474294238,
      },
      {
        name: '화수동',
        lat: 37.4850220245415,
        lng: 126.62989551793926,
      },
      {
        name: '송현동',
        lat: 37.48689471968519,
        lng: 126.63989719099165,
      },
      {
        name: '화평동',
        lat: 37.47909201921672,
        lng: 126.63099759530998,
      },
      {
        name: '창영동',
        lat: 37.470725745617216,
        lng: 126.6407820122942,
      },
      {
        name: '금곡동',
        lat: 37.47267862248604,
        lng: 126.64006488470682,
      },
      {
        name: '송림동',
        lat: 37.47857239592762,
        lng: 126.65089724347236,
      },
    ],
    미추홀구: [
      {
        name: '숭의동',
        lat: 37.463119405354064,
        lng: 126.65086505158582,
      },
      {
        name: '용현동',
        lat: 37.45170402146754,
        lng: 126.64710355602924,
      },
      {
        name: '학익동',
        lat: 37.43946962711642,
        lng: 126.65474320630328,
      },
      {
        name: '도화동',
        lat: 37.47054179465083,
        lng: 126.66428364223756,
      },
      {
        name: '주안동',
        lat: 37.45697468221797,
        lng: 126.68100021603752,
      },
      {
        name: '관교동',
        lat: 37.4427055769391,
        lng: 126.69443005335395,
      },
      {
        name: '문학동',
        lat: 37.436563110137776,
        lng: 126.68553008031375,
      },
    ],
    연수구: [
      {
        name: '옥련동',
        lat: 37.42425489442003,
        lng: 126.64845062472942,
      },
      {
        name: '선학동',
        lat: 37.42967875535112,
        lng: 126.69755930924045,
      },
      {
        name: '연수동',
        lat: 37.420411615084646,
        lng: 126.68329927637954,
      },
      {
        name: '청학동',
        lat: 37.42481991987537,
        lng: 126.66645495162513,
      },
      {
        name: '동춘동',
        lat: 37.406880384990856,
        lng: 126.66436952948206,
      },
      {
        name: '송도동',
        lat: 37.38559014318496,
        lng: 126.63896117977292,
      },
    ],
    남동구: [
      {
        name: '구월동',
        lat: 37.44872517114707,
        lng: 126.71112030429222,
      },
      {
        name: '간석동',
        lat: 37.46555313011437,
        lng: 126.70719797500392,
      },
      {
        name: '만수동',
        lat: 37.45498064367676,
        lng: 126.73503506201972,
      },
      {
        name: '장수동',
        lat: 37.45883475571306,
        lng: 126.76102762705958,
      },
      {
        name: '서창동',
        lat: 37.43111928792843,
        lng: 126.7494665821376,
      },
      {
        name: '운연동',
        lat: 37.43953867510474,
        lng: 126.76427901994036,
      },
      {
        name: '남촌동',
        lat: 37.42466427553473,
        lng: 126.71088168817126,
      },
      {
        name: '수산동',
        lat: 37.436722087669565,
        lng: 126.72740309140784,
      },
      {
        name: '도림동',
        lat: 37.41893132794058,
        lng: 126.7264308375466,
      },
      {
        name: '논현동',
        lat: 37.40439981314909,
        lng: 126.72407406481338,
      },
      {
        name: '고잔동',
        lat: 37.395102051521306,
        lng: 126.69551121365468,
      },
    ],
    부평구: [
      {
        name: '부평동',
        lat: 37.48920615188612,
        lng: 126.72338103857946,
      },
      {
        name: '십정동',
        lat: 37.47742243752018,
        lng: 126.69974236542896,
      },
      {
        name: '산곡동',
        lat: 37.500074456818055,
        lng: 126.7023318736838,
      },
      {
        name: '청천동',
        lat: 37.51625258632304,
        lng: 126.70522958176258,
      },
      {
        name: '삼산동',
        lat: 37.51715469854328,
        lng: 126.7435149967721,
      },
      {
        name: '갈산동',
        lat: 37.51546416640628,
        lng: 126.7266215976264,
      },
      {
        name: '부개동',
        lat: 37.49290641508056,
        lng: 126.7371680525256,
      },
      {
        name: '일신동',
        lat: 37.478263592753606,
        lng: 126.74206196099988,
      },
      {
        name: '구산동',
        lat: 37.47284260120457,
        lng: 126.75354014009656,
      },
    ],
    계양구: [
      {
        name: '효성동',
        lat: 37.531770719967824,
        lng: 126.7022075573585,
      },
      {
        name: '계산동',
        lat: 37.54286322401635,
        lng: 126.72302608706713,
      },
      {
        name: '작전동',
        lat: 37.52978465407113,
        lng: 126.72979135548664,
      },
      {
        name: '서운동',
        lat: 37.53088688868995,
        lng: 126.75159133204303,
      },
      {
        name: '임학동',
        lat: 37.547182291105486,
        lng: 126.73418727310428,
      },
      {
        name: '용종동',
        lat: 37.54079638372218,
        lng: 126.74480223852342,
      },
      {
        name: '병방동',
        lat: 37.545483032116245,
        lng: 126.74911953399244,
      },
      {
        name: '방축동',
        lat: 37.5545064261281,
        lng: 126.7332644734106,
      },
      {
        name: '박촌동',
        lat: 37.55188019172404,
        lng: 126.75154566274443,
      },
      {
        name: '동양동',
        lat: 37.55898949787711,
        lng: 126.7611195375114,
      },
      {
        name: '귤현동',
        lat: 37.56749153820577,
        lng: 126.74702083865814,
      },
      {
        name: '상야동',
        lat: 37.57488607174811,
        lng: 126.77207658670234,
      },
      {
        name: '하야동',
        lat: 37.58088929562904,
        lng: 126.78593033039606,
      },
      {
        name: '평동',
        lat: 37.583489828897285,
        lng: 126.77158265861186,
      },
      {
        name: '노오지동',
        lat: 37.58039028065137,
        lng: 126.75892803257685,
      },
      {
        name: '선주지동',
        lat: 37.57813688147145,
        lng: 126.74785190702283,
      },
      {
        name: '이화동',
        lat: 37.58710196069571,
        lng: 126.73859932893453,
      },
      {
        name: '오류동',
        lat: 37.585129747054296,
        lng: 126.72771008296888,
      },
      {
        name: '갈현동',
        lat: 37.57895608830136,
        lng: 126.721992918577,
      },
      {
        name: '둑실동',
        lat: 37.57608811409242,
        lng: 126.69798016044857,
      },
      {
        name: '목상동',
        lat: 37.56426588695199,
        lng: 126.71016260666644,
      },
      {
        name: '다남동',
        lat: 37.56394852129775,
        lng: 126.72268620912826,
      },
      {
        name: '장기동',
        lat: 37.575876171566726,
        lng: 126.73509317519928,
      },
    ],
    서구: [
      {
        name: '백석동',
        lat: 37.57921523248984,
        lng: 126.66884261354922,
      },
      {
        name: '시천동',
        lat: 37.570802199235935,
        lng: 126.68797628003284,
      },
      {
        name: '검암동',
        lat: 37.56450493320631,
        lng: 126.6749672479002,
      },
      {
        name: '경서동',
        lat: 37.55672299771948,
        lng: 126.64900632158746,
      },
      {
        name: '공촌동',
        lat: 37.55118684122591,
        lng: 126.6946195125984,
      },
      {
        name: '연희동',
        lat: 37.547288224876816,
        lng: 126.66589458621114,
      },
      {
        name: '심곡동',
        lat: 37.54150808519326,
        lng: 126.6799376154462,
      },
      {
        name: '가정동',
        lat: 37.52729739732689,
        lng: 126.6756046805831,
      },
      {
        name: '신현동',
        lat: 37.51902705771887,
        lng: 126.66711712501284,
      },
      {
        name: '석남동',
        lat: 37.50548856108045,
        lng: 126.6664647671141,
      },
      {
        name: '원창동',
        lat: 37.51267515510083,
        lng: 126.62678126228876,
      },
      {
        name: '가좌동',
        lat: 37.489829007859,
        lng: 126.67368554230671,
      },
      {
        name: '마전동',
        lat: 37.605520876790685,
        lng: 126.66704280290864,
      },
      {
        name: '당하동',
        lat: 37.58728553305717,
        lng: 126.6937465794418,
      },
      {
        name: '원당동',
        lat: 37.596887479338704,
        lng: 126.70791769280524,
      },
      {
        name: '대곡동',
        lat: 37.625954786512345,
        lng: 126.66568939447912,
      },
      {
        name: '금곡동',
        lat: 37.61455549501079,
        lng: 126.64297909082872,
      },
      {
        name: '오류동',
        lat: 37.58638653507276,
        lng: 126.62011866231568,
      },
      {
        name: '왕길동',
        lat: 37.59129699319064,
        lng: 126.65072609217876,
      },
      {
        name: '불로동',
        lat: 37.60986713122384,
        lng: 126.68867887114642,
      },
      {
        name: '청라동',
        lat: 37.53450107509822,
        lng: 126.6277037855033,
      },
    ],
    강화군: [
      {
        name: '강화읍',
        lat: 37.75174404376796,
        lng: 126.48814209888104,
      },
      {
        name: '강화읍',
        lat: 37.74355966059915,
        lng: 126.47977539116845,
      },
      {
        name: '강화읍',
        lat: 37.75023534438206,
        lng: 126.48571209755455,
      },
      {
        name: '강화읍',
        lat: 37.7424170296309,
        lng: 126.4583990076662,
      },
      {
        name: '강화읍',
        lat: 37.73562416148153,
        lng: 126.47993280064834,
      },
      {
        name: '강화읍',
        lat: 37.73839392490281,
        lng: 126.50534440357126,
      },
      {
        name: '강화읍',
        lat: 37.74624992017266,
        lng: 126.514542174376,
      },
      {
        name: '강화읍',
        lat: 37.75609814672754,
        lng: 126.50204362567312,
      },
      {
        name: '강화읍',
        lat: 37.77056069023903,
        lng: 126.50271114696956,
      },
      {
        name: '강화읍',
        lat: 37.77389375913378,
        lng: 126.4910319930865,
      },
      {
        name: '선원면',
        lat: 37.71609690007635,
        lng: 126.4860768704915,
      },
      {
        name: '선원면',
        lat: 37.706893836080894,
        lng: 126.49004974249117,
      },
      {
        name: '선원면',
        lat: 37.701723791645584,
        lng: 126.50983005945427,
      },
      {
        name: '선원면',
        lat: 37.71465859772702,
        lng: 126.50231505472767,
      },
      {
        name: '선원면',
        lat: 37.72484767651176,
        lng: 126.5059425459269,
      },
      {
        name: '선원면',
        lat: 37.72823951433244,
        lng: 126.48830976117831,
      },
      {
        name: '선원면',
        lat: 37.72547307060532,
        lng: 126.4576037276162,
      },
      {
        name: '선원면',
        lat: 37.71099573808773,
        lng: 126.4735843231543,
      },
      {
        name: '불은면',
        lat: 37.684073166089696,
        lng: 126.48168659120564,
      },
      {
        name: '불은면',
        lat: 37.68228077477599,
        lng: 126.4840675333012,
      },
      {
        name: '불은면',
        lat: 37.688387824404096,
        lng: 126.50295489257007,
      },
      {
        name: '불은면',
        lat: 37.67765054179697,
        lng: 126.50976303320115,
      },
      {
        name: '불은면',
        lat: 37.6684915525477,
        lng: 126.50777554306484,
      },
      {
        name: '불은면',
        lat: 37.65824449808758,
        lng: 126.50419735311462,
      },
      {
        name: '불은면',
        lat: 37.69059007713768,
        lng: 126.4605714167896,
      },
      {
        name: '불은면',
        lat: 37.70760883232301,
        lng: 126.44706359176412,
      },
      {
        name: '불은면',
        lat: 37.6540781646929,
        lng: 126.51933459105044,
      },
      {
        name: '길상면',
        lat: 37.627482945130346,
        lng: 126.49778107217082,
      },
      {
        name: '길상면',
        lat: 37.64060562981482,
        lng: 126.48441995168712,
      },
      {
        name: '길상면',
        lat: 37.61493814209777,
        lng: 126.48660019727926,
      },
      {
        name: '길상면',
        lat: 37.58881406193452,
        lng: 126.51511361492898,
      },
      {
        name: '길상면',
        lat: 37.62799215612616,
        lng: 126.52263036049614,
      },
      {
        name: '길상면',
        lat: 37.62303002802335,
        lng: 126.50718985911412,
      },
      {
        name: '길상면',
        lat: 37.65831232837683,
        lng: 126.48668177620274,
      },
      {
        name: '화도면',
        lat: 37.61884511135879,
        lng: 126.4240652647498,
      },
      {
        name: '화도면',
        lat: 37.63387747888686,
        lng: 126.39863086120072,
      },
      {
        name: '화도면',
        lat: 37.63128150051827,
        lng: 126.41920682372664,
      },
      {
        name: '화도면',
        lat: 37.6330623467023,
        lng: 126.43221290770164,
      },
      {
        name: '화도면',
        lat: 37.627472944563245,
        lng: 126.4495676271052,
      },
      {
        name: '화도면',
        lat: 37.60886897065866,
        lng: 126.4582099178625,
      },
      {
        name: '화도면',
        lat: 37.5987093392768,
        lng: 126.442321020363,
      },
      {
        name: '화도면',
        lat: 37.60633238084361,
        lng: 126.4216928610861,
      },
      {
        name: '화도면',
        lat: 37.60436466586346,
        lng: 126.3990664242811,
      },
      {
        name: '화도면',
        lat: 37.6202843353292,
        lng: 126.38900821142762,
      },
      {
        name: '양도면',
        lat: 37.672514521478746,
        lng: 126.43263005769708,
      },
      {
        name: '양도면',
        lat: 37.66484667167874,
        lng: 126.4187210908372,
      },
      {
        name: '양도면',
        lat: 37.65673325741006,
        lng: 126.42474367453153,
      },
      {
        name: '양도면',
        lat: 37.68304711665223,
        lng: 126.40211667455526,
      },
      {
        name: '양도면',
        lat: 37.69904537040441,
        lng: 126.41626128828152,
      },
      {
        name: '양도면',
        lat: 37.68093928736212,
        lng: 126.4259480335446,
      },
      {
        name: '양도면',
        lat: 37.66515334744013,
        lng: 126.46101258288942,
      },
      {
        name: '양도면',
        lat: 37.65245047248344,
        lng: 126.45091647187164,
      },
      {
        name: '양도면',
        lat: 37.65228322042304,
        lng: 126.43525292316971,
      },
      {
        name: '내가면',
        lat: 37.72302123501336,
        lng: 126.39417401954924,
      },
      {
        name: '내가면',
        lat: 37.723701777523495,
        lng: 126.41279003857876,
      },
      {
        name: '내가면',
        lat: 37.732926563118745,
        lng: 126.3871302134741,
      },
      {
        name: '내가면',
        lat: 37.70527360967216,
        lng: 126.38191299416104,
      },
      {
        name: '내가면',
        lat: 37.716687869119895,
        lng: 126.36234775094158,
      },
      {
        name: '내가면',
        lat: 37.73131112984571,
        lng: 126.36376790721252,
      },
      {
        name: '하점면',
        lat: 37.762350182667056,
        lng: 126.40120307697704,
      },
      {
        name: '하점면',
        lat: 37.7768997227472,
        lng: 126.40930366074852,
      },
      {
        name: '하점면',
        lat: 37.78121209062973,
        lng: 126.4295077893811,
      },
      {
        name: '하점면',
        lat: 37.7642131196226,
        lng: 126.43597848449508,
      },
      {
        name: '하점면',
        lat: 37.7546134856677,
        lng: 126.41999598000568,
      },
      {
        name: '하점면',
        lat: 37.75256952588267,
        lng: 126.40048565843058,
      },
      {
        name: '하점면',
        lat: 37.74867632325016,
        lng: 126.37424070548924,
      },
      {
        name: '하점면',
        lat: 37.76651919990472,
        lng: 126.3691169935609,
      },
      {
        name: '하점면',
        lat: 37.77259765336941,
        lng: 126.3895821257,
      },
      {
        name: '양사면',
        lat: 37.80147286300103,
        lng: 126.4031232074081,
      },
      {
        name: '양사면',
        lat: 37.81907323826796,
        lng: 126.43856588764991,
      },
      {
        name: '양사면',
        lat: 37.80102338979064,
        lng: 126.42563390638604,
      },
      {
        name: '양사면',
        lat: 37.81705423561798,
        lng: 126.41333338055613,
      },
      {
        name: '양사면',
        lat: 37.79758143323611,
        lng: 126.39644137400134,
      },
      {
        name: '양사면',
        lat: 37.788312302006894,
        lng: 126.37072456819614,
      },
      {
        name: '송해면',
        lat: 37.77889380920369,
        lng: 126.45958781506722,
      },
      {
        name: '송해면',
        lat: 37.76752159027875,
        lng: 126.4641017337117,
      },
      {
        name: '송해면',
        lat: 37.76866340561254,
        lng: 126.47836130912695,
      },
      {
        name: '송해면',
        lat: 37.78941476654612,
        lng: 126.47305765423462,
      },
      {
        name: '송해면',
        lat: 37.800946304702805,
        lng: 126.45694967562255,
      },
      {
        name: '송해면',
        lat: 37.77919002547096,
        lng: 126.4598455055242,
      },
      {
        name: '송해면',
        lat: 37.75831777050311,
        lng: 126.45312668152536,
      },
      {
        name: '송해면',
        lat: 37.79275645604032,
        lng: 126.44420196412504,
      },
      {
        name: '교동면',
        lat: 37.78677020994294,
        lng: 126.26543536789374,
      },
      {
        name: '교동면',
        lat: 37.78026136311954,
        lng: 126.27748969542364,
      },
      {
        name: '교동면',
        lat: 37.77130558432098,
        lng: 126.29439364214694,
      },
      {
        name: '교동면',
        lat: 37.78328948847427,
        lng: 126.3104064039942,
      },
      {
        name: '교동면',
        lat: 37.79718982499004,
        lng: 126.32025516066764,
      },
      {
        name: '교동면',
        lat: 37.793237767149854,
        lng: 126.29067670323268,
      },
      {
        name: '교동면',
        lat: 37.79345415897018,
        lng: 126.26043583425891,
      },
      {
        name: '교동면',
        lat: 37.80806398435452,
        lng: 126.26664724727532,
      },
      {
        name: '교동면',
        lat: 37.779920638528765,
        lng: 126.2341097340551,
      },
      {
        name: '교동면',
        lat: 37.77505921136146,
        lng: 126.258415902205,
      },
      {
        name: '교동면',
        lat: 37.7622265330044,
        lng: 126.2362386665128,
      },
      {
        name: '교동면',
        lat: 37.76984644825731,
        lng: 126.21786399798164,
      },
      {
        name: '교동면',
        lat: 37.79569133619921,
        lng: 126.2341063304476,
      },
      {
        name: '교동면',
        lat: 37.80677701726693,
        lng: 126.24302209625648,
      },
      {
        name: '삼산면',
        lat: 37.698771535553234,
        lng: 126.32023886166672,
      },
      {
        name: '삼산면',
        lat: 37.69865137997266,
        lng: 126.3160642787171,
      },
      {
        name: '삼산면',
        lat: 37.731083124151,
        lng: 126.31241520665824,
      },
      {
        name: '삼산면',
        lat: 37.724656451963774,
        lng: 126.29590932514448,
      },
      {
        name: '삼산면',
        lat: 37.684327902028514,
        lng: 126.36194491559044,
      },
      {
        name: '삼산면',
        lat: 37.67049107984938,
        lng: 126.3396790090951,
      },
      {
        name: '삼산면',
        lat: 37.72266407841786,
        lng: 126.23183844696445,
      },
      {
        name: '삼산면',
        lat: 37.73037161254828,
        lng: 126.26339440673117,
      },
      {
        name: '서도면',
        lat: 37.66208174695132,
        lng: 126.1996326972381,
      },
      {
        name: '서도면',
        lat: 37.64382077599469,
        lng: 126.2426156666018,
      },
      {
        name: '서도면',
        lat: 37.66197575226384,
        lng: 126.22866130209972,
      },
      {
        name: '서도면',
        lat: 37.67610992992614,
        lng: 126.10629035793116,
      },
      {
        name: '서도면',
        lat: 37.671838435724304,
        lng: 126.1874495723618,
      },
    ],
    옹진군: [
      {
        name: '북도면',
        lat: 37.53298122779845,
        lng: 126.40161124109405,
      },
      {
        name: '북도면',
        lat: 37.535602355556286,
        lng: 126.42677517161596,
      },
      {
        name: '북도면',
        lat: 37.52701877170181,
        lng: 126.45431303192144,
      },
      {
        name: '북도면',
        lat: 37.53322497595124,
        lng: 126.4084536537536,
      },
      {
        name: '북도면',
        lat: 37.53789554343577,
        lng: 126.34001665137406,
      },
      {
        name: '백령면',
        lat: 37.95366858467937,
        lng: 124.67487279219316,
      },
      {
        name: '백령면',
        lat: 37.96468282625175,
        lng: 124.7035738212937,
      },
      {
        name: '백령면',
        lat: 37.95891297360289,
        lng: 124.6760447017742,
      },
      {
        name: '백령면',
        lat: 37.95957945144329,
        lng: 124.6491923760722,
      },
      {
        name: '백령면',
        lat: 37.94857682142636,
        lng: 124.63467243399914,
      },
      {
        name: '백령면',
        lat: 37.9335926219138,
        lng: 124.677966409038,
      },
      {
        name: '대청면',
        lat: 37.81457864051524,
        lng: 124.70929768551456,
      },
      {
        name: '대청면',
        lat: 37.82457758796517,
        lng: 124.699608112148,
      },
      {
        name: '대청면',
        lat: 37.77144105977409,
        lng: 124.75106002608403,
      },
      {
        name: '덕적면',
        lat: 37.19913109067012,
        lng: 126.09143005425092,
      },
      {
        name: '덕적면',
        lat: 37.25784682579148,
        lng: 126.10803904528852,
      },
      {
        name: '덕적면',
        lat: 37.22807916466954,
        lng: 126.13967382690387,
      },
      {
        name: '덕적면',
        lat: 37.22489831167316,
        lng: 126.10189235406138,
      },
      {
        name: '덕적면',
        lat: 37.21361947516797,
        lng: 126.1742722612604,
      },
      {
        name: '덕적면',
        lat: 37.023613334435744,
        lng: 125.97869250130545,
      },
      {
        name: '덕적면',
        lat: 37.07681503271006,
        lng: 125.97187416045855,
      },
      {
        name: '덕적면',
        lat: 37.17642318943172,
        lng: 126.09870110959912,
      },
      {
        name: '덕적면',
        lat: 37.191302941884615,
        lng: 125.9785573766778,
      },
      {
        name: '영흥면',
        lat: 37.25733490335769,
        lng: 126.46809337122326,
      },
      {
        name: '영흥면',
        lat: 37.24584348687988,
        lng: 126.45136010919754,
      },
      {
        name: '영흥면',
        lat: 37.26840407862562,
        lng: 126.47033116636575,
      },
      {
        name: '영흥면',
        lat: 37.24438891078899,
        lng: 126.52445083895506,
      },
      {
        name: '자월면',
        lat: 37.19090759756087,
        lng: 126.24926074809528,
      },
      {
        name: '자월면',
        lat: 37.258397222081456,
        lng: 126.31318075313244,
      },
      {
        name: '자월면',
        lat: 37.17588057955477,
        lng: 126.25117672062868,
      },
      {
        name: '자월면',
        lat: 37.12505231243217,
        lng: 126.17725313808369,
      },
      {
        name: '연평면',
        lat: 37.660144392236106,
        lng: 125.6988177097298,
      },
      {
        name: '연평면',
        lat: 37.660144392236106,
        lng: 125.6988177097298,
      },
    ],
  },
};
export default regionData;
