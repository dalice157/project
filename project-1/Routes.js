import { uaIsMobile } from 'react-device-detect';
import Homev2 from './containers/home_v2';
import Marketingv3 from './containers/marketing_v3';
import Chat from './containers/chat_v3';
import Editor from './containers/editor';
import ServiceItems from './containers/serviceItems';
import EditProfilev2 from './containers/editProfile_v2';
import ShareSettingv2 from './containers/shareSetting_v2';
import Payment from './containers/payment';
import ServiceList from './containers/search';
import Demandv3 from './containers/demand_v3';
import DemandOverview from './containers/demand_v3/Overview';
import Extend from './containers/demand_v3/extend';
import EnableCase from './containers/enableCase';
import CaseFormv3 from './containers/demand_v3/caseForm';
import JoinCaseForm from './containers/demand_v3/joinCaseForm';
import PlanSelectV3 from './containers/demand_v3/planSelect';
import FinishDemandV3 from './containers/demand_v3/finished';
import Evaluation from './containers/evaluation';
import EvaluationList from './containers/evaluation/List';
import Collection from './containers/myCollection';
import CaseList from './containers/caseList_v3';
import CaseInfov3 from './containers/caseList_v3/CaseInfo';
import SetEDMContent from './containers/setting/ListMobile';
import UnsubscribeEDM from './containers/setting/UnsubscribeEDM';
import EditCaseFormv3 from './containers/demand_v3/editCaseForm/index';
import Profile from './containers/profile';
import Service from './containers/service';
import SetEDMMobile from './containers/setting/SideBarMobile';
import SetEDM from './containers/setting/SetEDM';
import EvaluationEDM from './containers/evaluation/EvaluationEDM';
import TopperOverview from './containers/caseManagement_v2/Overview';
import TopperList from './containers/caseManagement_v2/Lists';
import PublicationPlan from './containers/publicationPlan';
import UpgradePlan from './containers/upgrade/UpgradePlan';
import UpgradePayment from './containers/upgrade/UpgradePayment';
import UpgradeSuccess from './containers/upgrade/UpgradeSuccess';
import routePath from './config/routePath';
import {
  initialService, initialCaseInfo, initialProfile, initGigList, initCaseList,
} from './actions/ssr';
import config from './config/config';

const isMobile = uaIsMobile();
const settingLink = isMobile ? '/setting' : '/settingEdm';
const settingComponent = isMobile ? SetEDMMobile : SetEDM;

const Routes = [
  {
    path: routePath.root,
    exact: true,
    component: Homev2,
  },
  {
    path: routePath.marketing,
    component: Marketingv3,
  },
  {
    path: routePath.chat,
    component: Chat,
  },
  {
    path: routePath.joinCaseForm,
    component: JoinCaseForm,
  },
  {
    path: routePath.editor,
    component: Editor,
  },
  {
    path: routePath.serviceItems,
    component: ServiceItems,
  },
  {
    path: routePath.editProfile,
    component: EditProfilev2,
  },
  {
    path: routePath.success,
    component: ShareSettingv2,
  },
  {
    path: routePath.search,
    component: ServiceList,
    getInitialData: (store, match, location) => initGigList(store, location),
  },
  {
    path: routePath.searchT,
    component: ServiceList,
    getInitialData: (store, match, location) => initGigList(store, location),
  },
  {
    path: routePath.demand,
    component: Demandv3,
    exact: true,
  },
  {
    path: routePath.evaluation,
    component: Evaluation,
  },
  {
    path: routePath.evaluationList,
    component: EvaluationList,
  },
  {
    path: routePath.collection,
    component: Collection,
  },
  {
    path: routePath.extend,
    component: Extend,
  },
  {
    path: routePath.caseList,
    component: CaseList,
    getInitialData: (store, match, location) => initCaseList(store, location),
  },
  {
    path: routePath.caseInfo,
    component: CaseInfov3,
    getInitialData: (store, match, location) => {
      const { basicId } = location.query;
      const { demandId } = location.query;
      return initialCaseInfo(store, basicId, demandId);
    },
  },
  {
    path: routePath.unsubscribe,
    component: UnsubscribeEDM,
  },
  {
    path: routePath.edmContent,
    component: SetEDMContent,
  },
  {
    path: routePath.enableCaseUser,
    component: EnableCase,
  },
  {
    path: routePath.editCaseForm,
    component: EditCaseFormv3,
  },
  {
    path: routePath.caseForm,
    component: CaseFormv3,
  },
  {
    path: routePath.planSelect,
    component: PlanSelectV3,
  },
  {
    path: routePath.finished,
    component: FinishDemandV3,
  },
  {
    path: routePath.service,
    component: Service,
    getInitialData: (store, match, location) => {
      const { basicId } = match.params;
      const { gigId } = location.query;
      return initialService(store, basicId, gigId);
    },
  },
  {
    path: routePath.profile,
    component: Profile,
    getInitialData: (store, match, location) => {
      const { basicId } = match.params;
      const { topperId, quotationId } = location.query;
      return initialProfile(store, basicId, topperId, quotationId);
    },
  },
  {
    path: settingLink,
    component: settingComponent,
  },
  {
    path: routePath.EvaluationEDM,
    component: EvaluationEDM,
  },
  {
    path: routePath.topperDashboard,
    component: TopperOverview,
  },
  {
    path: routePath.topperDashboardPaidRecord,
    component: TopperOverview,
  },
  {
    path: routePath.topperDashboardInviting,
    component: TopperList,
  },
  {
    path: routePath.topperDashboardCommunication,
    component: TopperList,
  },
  {
    path: routePath.topperDashboardCooperation,
    component: TopperList,
  },
  {
    path: routePath.topperDashboardClosed,
    component: TopperList,
  },
  {
    path: routePath.topperDashboardApplied,
    component: TopperList,
  },
  {
    path: routePath.topperDashboardContact,
    component: TopperList,
  },
  {
    path: routePath.publicationPlan,
    component: PublicationPlan,
  },
  {
    path: routePath.payment,
    component: Payment,
  },
  {
    path: routePath.candidate,
    component: DemandOverview,
  },
  {
    path: routePath.invitees,
    component: DemandOverview,
  },
];

if (config.featureSwitch.VL10160) {
  Routes.push(
    {
      path: routePath.upgradePlan,
      component: UpgradePlan,
    },
    {
      path: routePath.upgradePayment,
      component: UpgradePayment,
    },
    {
      path: routePath.upgradeSuccess,
      component: UpgradeSuccess,
    },
  );
}

export default Routes;
