import './style.css'
import { i18nextSetUp } from './init';
import { state } from './init';
import 'bootstrap/dist/css/bootstrap.min.css';
import { initView } from './view';

i18nextSetUp().then(() => {
    initView()
})

