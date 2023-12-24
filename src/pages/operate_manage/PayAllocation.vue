<!-- 支付配置 - 入款管理 - 支付分配 -->
<template>
  <div class="pay-allocation">
    <div class="label-box">
      <div class="left-arrow" v-show="arrowIndex>minArrowIndex">
        <span class="iconfont icon-label-left pointer" @click="moveLeft"></span>
      </div>
      <div class="right-arrow" v-show="arrowIndex<maxArrowIndex">
        <span class="iconfont icon-label-right pointer" @click="moveRight"></span>
      </div>
      <div class="label-container" ref="labelWidth">
        <ul class="label-list">
          <li :class="[labelIndex===index? 'active': '']" @click="labelClick(index)" class="label-list-li" v-for="(item, index) in listGroup" :key="index">{{item.groupName}}</li>
        </ul>
      </div>
    </div>
    <div class="bank-card-box" v-loading="isLoading">
      <div class="box box1">
        <div class="box-left">{{ $t('类型') }}</div>
        <div class="box-right">
          <div class="box-right-box">
            <div class="box-right-box-left" style="align-self:center">{{ $t('名称') }}</div>
            <div class="box-right-box-middle b-right fc">{{ $t('显示区域(拖拽面板进行操作)') }}</div>
            <div class="box-right-box-right fc">{{ $t('隐藏区域') }}</div>
          </div>
        </div>
      </div>
      <div :class="{box: true, 'b-bottom': !secondShow && !eighthShow}">
        <div class="box-left">{{ $t('公司入款') }}</div>
        <div class="box-right">
          <!-- 加密货币 -->
          <div class="box-right-box"  v-if="crPayShow">
            <div class="box-right-box-left">
              <div class="center">
                <p>{{ $t('加密货币支付') }}</p>
                <el-select v-model="crQueue" @change="onCrEnd" :disabled="!permissions.edit">
                  <el-option :label="$t('排队')" :value="1"></el-option>
                  <el-option :label="$t('平铺')" :value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="box-right-box-middle">
              <section>
                <draggable class="drag" v-model="crPayLeft" :options="!permissions.drag?disDragOption:dragOptions2" :move="onMove" @change="onCrEnd">
                  <div v-for="(item, index) in crPayLeft" :key="index" class="undraggable">
                    <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']" :ref="'crPay' + index" @click="openPopover(item, 5, 1, 'crPay' + index)">
                      <div class="first">{{ $t('显示') }}</div>
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.name}}</div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </section>
            </div>
            <div class="box-right-box-right">
              <section class="child3-fourth-third child3-item">
                <draggable class="drag" v-model="crPayRight" :options="!permissions.drag?disDragOption:dragOptions2" :move="onMove">
                    <div v-for="item in crPayRight" :key="item.id" class="undraggable">
                        <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']">
                          <img :src="item.bankLogo">
                          <div class="ct">
                            <div>{{item.name}}</div>
                          </div>
                        </div>
                    </div>
                </draggable>
              </section>
            </div>
          </div>
          <!-- 银行卡转账 -->
          <div class="box-right-box b-top">
            <div class="box-right-box-left" ref="yinhang">
              <div class="center">
                <p>{{ $t('银行卡转账') }}</p>
                <el-select v-model="bankeQueue" @change="onDepositEnd" :disabled="!permissions.edit">
                  <el-option :label="$t('排队')" :value="1"></el-option>
                  <el-option :label="$t('平铺')" :value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="box-right-box-middle box-up">
              <div class="box-right-box-middle-drag" v-for="(element, elementIndex) in tierArr" :key="elementIndex" :class="[elementIndex > 0 ? 'b-top': '']">
                <span class="number">{{elementIndex + 1}}</span>
                <draggable class="drag" :style="{height: fullHeight  + 'px'}" style="padding: 0 20px" v-model="depositBankcardListLeft[elementIndex]" :options="!permissions.drag?disDragOption:dragOptions1" :move="onMove" @change="onDepositEnd">
                    <div v-for="(item, index) in depositBankcardListLeft[elementIndex]" :key="item.name" class="height60 undraggable">
                      <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']" :ref="elementIndex + 'online' + index" @click="openPopover(item, 1, 1, elementIndex + 'online' + index)">
                      <div class="first" v-show="index===0 && item.depositAmount < item.dayMaxAmout">{{ $t('显示') }}</div>
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.bankName}}</div>
                        <div>{{item.realName}}</div>
                        <div><span :class="[item.depositAmount >= item.dayMaxAmout? 'red': 'green']">{{item.depositAmount}}</span>/<span :class="[item.depositAmount >= item.dayMaxAmout? 'red': '']">{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                    </div>
                </draggable>
                <i v-show="elementIndex > 0 && permissions.edit"  class="el-icon-remove" @click="deleteDeposit(elementIndex)"></i>
              </div>
              <div v-if="permissions.edit" class="box-right-box-middle-drag b-top add-bank-display">
                <span @click="addDeposit()">
                  {{ $t('新增银行卡展示') }}&nbsp;&nbsp;
                  <i class="el-icon-circle-plus-outline"></i>
                </span>
              </div>
            </div>
            <div class="box-right-box-right">
               <draggable class="drag" v-model="depositBankcardListRight" :options="!permissions.drag?disDragOption:dragOptions1" :move="onMove">
                <div v-for="item in depositBankcardListRight" :key="item.name" class="height60 undraggable">
                    <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']">
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.bankName}}</div>
                        <div>{{item.realName}}</div>
                        <div><span>{{item.depositAmount}}</span>/<span>{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                </div>
            </draggable>
            </div>
          </div>
          <div class="box-right-box b-top" v-if="secondShow">
            <div class="box-right-box-left">
              <div class="center">
                <p>{{ $t('自动入款平台') }}</p>
                <!-- <el-select v-model="autoQueue" @change="onAutoEnd" :disabled="!permissions.edit">
                  <el-option label="排队" :value="1"></el-option>
                  <el-option label="平铺" :value="0"></el-option>
                </el-select> -->
              </div>
            </div>
            <div class="box-right-box-middle">
              <div class="box-right-box-middle-drag" v-for="(value, key, typeIndex) in depositAutoSorter" :key="typeIndex" :class="[typeIndex > 0 ? 'b-top': '']">
                <span class="number netBank">
                  <div class="center">
                    <p>{{depositAutoSort[key].text}}</p>
                    <el-select v-model="depositAutoSort[key].isQueue" @change="onAutoEnd" :disabled="!permissions.edit">
                      <el-option :label="$t('排队')" :value="1"></el-option>
                      <el-option :label="$t('平铺')" :value="0"></el-option>
                    </el-select>
                  </div>
                </span>
                <draggable class="drag" v-model="depositAutoSorter[key]" :options="!permissions.drag?disDragOption:dragOptions2" :move="onMove" @change="onAutoEnd">
                  <div v-for="(item, index) in value" :key="index" class="undraggable">
                    <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']" :ref="'depositAuto' + index" @click="openPopoverForAuto(item.deposits, 'depositAuto' + index)">
                      <div class="first" v-show="item.depositAmount < item.dayMaxAmout">{{ $t('显示') }}</div>
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.name}}</div>
                        <div><span :class="[item.depositAmount >= item.dayMaxAmout? 'red': 'green']">{{item.depositAmount}}</span>/<span :class="[item.depositAmount >= item.dayMaxAmout? 'red': '']">{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </div>
            </div>
            <div class="box-right-box-right">
              <section class="child3-fourth-third child3-item">
                <draggable class="drag" v-model="depositAutoRight" :options="!permissions.drag?disDragOption:dragOptions2" :move="onMove">
                    <div v-for="item in depositAutoRight" :key="item.id" class="undraggable">
                        <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']">
                          <img :src="item.bankLogo">
                          <div class="ct">
                            <div>{{item.name}}</div>
                            <div><span>{{item.depositAmount}}</span>/<span>{{item.dayMaxAmout}}</span></div>
                          </div>
                        </div>
                    </div>
                </draggable>
              </section>
            </div>


          </div>
          <!-- 普通扫码支付 -->
          <div class="box-right-box b-top" v-if="qrcodesShow">
            <div class="box-right-box-left">
              <div class="center">
                <p>{{ $t('普通扫码支付') }}</p>
                <el-select v-model="qrcodeQueue" @change="onQrcodeEnd" :disabled="!permissions.edit">
                  <el-option :label="$t('排队')" :value="1"></el-option>
                  <el-option :label="$t('平铺')" :value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="box-right-box-middle">
              <section>
                <draggable class="drag" v-model="qrCodesLeft" :options="!permissions.drag?disDragOption:dragOptionsQrcodePay" :move="onMove" @change="onQrcodeEnd">
                  <div v-for="(item, index) in qrCodesLeft" :key="index" class="undraggable">
                    <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']" :ref="'qrcodePay' + index" @click="openPopover(item, 4, 1, 'qrcodePay' + index)">
                      <div class="first" v-show="item.depositAmount < item.dayMaxAmout">{{ $t('显示') }}</div>
                      <img src="../../assets/img/qrcode_pay.png">
                      <div class="ct">
                        <div>{{item.name}}</div>
                        <div><span :class="[item.depositAmount >= item.dayMaxAmout? 'red': 'green']">{{item.depositAmount}}</span>/<span :class="[item.depositAmount >= item.dayMaxAmout? 'red': '']">{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </section>
            </div>
            <div class="box-right-box-right">
              <section class="child3-fourth-third child3-item">
                <draggable class="drag" v-model="qrCodesRight" :options="!permissions.drag?disDragOption:dragOptionsQrcodePay" :move="onMove">
                    <div v-for="item in qrCodesRight" :key="item.id" class="undraggable">
                        <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']">
                          <img src="../../assets/img/qrcode_pay.png">
                          <div class="ct">
                            <div>{{item.name}}</div>
                            <div><span>{{item.depositAmount}}</span>/<span>{{item.dayMaxAmout}}</span></div>
                          </div>
                        </div>
                    </div>
                </draggable>
              </section>
            </div>
          </div>
        </div>
      </div>
      <div class="box b-bottom" v-show="eighthShow">
        <div class="box-left">{{ $t('线上支付') }}</div>
        <div class="box-right">
          <div class="box-right-box b-bottom" v-if="thirdShow&&qqQueue">
            <div class="box-right-box-left">
              <div class="center">
                <p>QQ</p>
                <el-select v-model="qqQueue" @change="onOnlineEnd" :disabled="!permissions.edit">
                  <el-option :label="$t('排队')" :value="1"></el-option>
                  <el-option :label="$t('平铺')" :value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="box-right-box-middle">
              <section>
                <draggable class="drag" v-model="onlineFirstListLeft" :options="!permissions.drag?disDragOption:dragOptions3" :move="onMove" @change="onOnlineEnd">
                  <div v-for="(item, index) in onlineFirstListLeft" :key="item.name" class="undraggable">
                    <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']" :ref="'qq' + index" @click="openPopover(item, 3, 1, 'qq' + index)">
                      <div class="first" v-show="item.depositAmount < item.dayMaxAmout">{{ $t('显示') }}</div>
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.name}}</div>
                        <div><span :class="[item.depositAmount >= item.dayMaxAmout? 'red': 'green']">{{item.depositAmount}}</span>/<span :class="[item.depositAmount >= item.dayMaxAmout? 'red': '']">{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </section>
            </div>
            <div class="box-right-box-right">
               <section class="child3-fourth-first child3-item" v-if="thirdShow">
                  <draggable class="drag" v-model="onlineFirstListRight" :options="!permissions.drag?disDragOption:dragOptions3" :move="onMove" >
                    <div v-for="item in onlineFirstListRight" :key="item.name" class="undraggable">
                        <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']">
                          <img :src="item.bankLogo">
                          <div class="ct">
                            <div>{{item.name}}</div>
                            <div><span>{{item.depositAmount}}</span>/<span>{{item.dayMaxAmout}}</span></div>
                          </div>
                        </div>
                    </div>
                </draggable>
              </section>
            </div>
          </div>
          <div class="box-right-box b-bottom" v-if="fourthShow">
            <div class="box-right-box-left">
              <div class="center">
                <p>{{ $t('微信') }}</p>
                <el-select v-model="wechatQueue" @change="onOnlineEnd" :disabled="!permissions.edit">
                  <el-option :label="$t('排队')" :value="1"></el-option>
                  <el-option :label="$t('平铺')" :value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="box-right-box-middle">
              <section class="child3-third-second child3-item">
                <draggable class="drag" v-model="onlineSecondListLeft" :options="!permissions.drag?disDragOption:dragOptions4" :move="onMove" @change="onOnlineEnd">
                  <div v-for="(item, index) in onlineSecondListLeft" :key="item.name" class="undraggable">
                    <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']" :ref="'wechat' + index" @click="openPopover(item, 3, 1, 'wechat' + index)">
                      <div class="first" v-show="item.depositAmount < item.dayMaxAmout">{{ $t('显示') }}</div>
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.name}}</div>
                        <div><span :class="[item.depositAmount >= item.dayMaxAmout? 'red': 'green']">{{item.depositAmount}}</span>/<span :class="[item.depositAmount >= item.dayMaxAmout? 'red': '']">{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </section>
            </div>
            <div class="box-right-box-right" v-if="fourthShow">
              <section class="child3-fourth-second child3-item">
                <draggable class="drag" v-model="onlineSecondListRight" :options="!permissions.drag?disDragOption:dragOptions4" :move="onMove">
                    <div v-for="item in onlineSecondListRight" :key="item.name" class="undraggable">
                        <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']">
                          <img :src="item.bankLogo">
                          <div class="ct">
                            <div>{{item.name}}</div>
                            <div><span>{{item.depositAmount}}</span>/<span>{{item.dayMaxAmout}}</span></div>
                          </div>
                        </div>
                    </div>
                </draggable>
              </section>
            </div>
          </div>
          <div class="box-right-box b-bottom" v-if="fifthShow">
            <div class="box-right-box-left">
              <div class="center">
                <p>{{ $t('京东') }}</p>
                <el-select v-model="jdQueue" @change="onOnlineEnd" :disabled="!permissions.edit">
                  <el-option :label="$t('排队')" :value="1"></el-option>
                  <el-option :label="$t('平铺')" :value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="box-right-box-middle">
              <section>
                <draggable class="drag" v-model="onlineThirdListLeft" :options="!permissions.drag?disDragOption:dragOptions5" :move="onMove" @change="onOnlineEnd">
                    <div v-for="(item, index) in onlineThirdListLeft" :key="item.name" class="undraggable">
                      <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']" :ref="'jingdong' + index" @click="openPopover(item, 3, 1, 'jingdong' + index)">
                        <div class="first" v-show="item.depositAmount < item.dayMaxAmout">{{ $t('显示') }}</div>
                        <img :src="item.bankLogo">
                        <div class="ct">
                          <div>{{item.name}}</div>
                          <div><span :class="[item.depositAmount >= item.dayMaxAmout? 'red': 'green']">{{item.depositAmount}}</span>/<span :class="[item.depositAmount >= item.dayMaxAmout? 'red': '']">{{item.dayMaxAmout}}</span></div>
                        </div>
                      </div>
                    </div>
                </draggable>
              </section>
            </div>
            <div class="box-right-box-right" v-if="fifthShow">
              <section class="child3-fourth-third child3-item">
                <draggable class="drag" v-model="onlineThirdListRight" :options="!permissions.drag?disDragOption:dragOptions5" :move="onMove">
                    <div v-for="item in onlineThirdListRight" :key="item.name" class="undraggable">
                        <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']">
                          <img :src="item.bankLogo">
                          <div class="ct">
                            <div>{{item.name}}</div>
                            <div><span>{{item.depositAmount}}</span>/<span>{{item.dayMaxAmout}}</span></div>
                          </div>
                        </div>
                    </div>
                </draggable>
              </section>
            </div>
          </div>
          <div class="box-right-box b-bottom" v-if="sixthShow">
            <div class="box-right-box-left">
              <div class="center">
                <p>{{ $t('网银') }}</p>
              </div>
            </div>
            <div class="box-right-box-middle">
              <div class="box-right-box-middle-drag" v-for="(value, key, typeIndex) in netBankSorter" :key="typeIndex" :class="[typeIndex > 0 ? 'b-top': '']">
                <span class="number netBank">
                  <div class="center">
                    <p>{{netBankSort[key].text}}</p>
                    <el-select v-model="netBankSort[key].isQueue" @change="onNetBankEnd" :disabled="!permissions.edit">
                      <el-option :label="$t('排队')" :value="1"></el-option>
                      <el-option :label="$t('平铺')" :value="0"></el-option>
                    </el-select>
                  </div>
                </span>
                <draggable class="drag" :style="{height: fullHeight  + 'px'}" style="padding: 0 20px" v-model="netBankSorter[key]" :options="!permissions.drag?disDragOption:{group: {name: key, put: ['description6']}}" :move="onMove" @change="onNetBankEnd">
                    <div v-for="(item, index) in value" :key="item.name" class="height60 undraggable">
                      <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']" :ref="key + index" @click="openPopover(item, 3, 1, key + index)">
                      <div class="first" v-show="item.depositAmount < item.dayMaxAmout">{{ $t('显示') }}</div>
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.name}}</div>
                        <div><span :class="[item.depositAmount >= item.dayMaxAmout? 'red': 'green']">{{item.depositAmount}}</span>/<span :class="[item.depositAmount >= item.dayMaxAmout? 'red': '']">{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                    </div>
                </draggable>
              </div>
            </div>
            <div class="box-right-box-right">
              <section>
                <draggable class="drag" v-model="onlineFouthListRight" :options="!permissions.drag?disDragOption:dragOptions6" :move="onMove">
                    <div v-for="item in onlineFouthListRight" :key="item.name" style="height: 0" class="undraggable">
                      <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']">
                        <img :src="item.bankLogo">
                        <div class="ct">
                          <div>{{item.name}}</div>
                          <div><span>{{item.depositAmount}}</span>/<span>{{item.dayMaxAmout}}</span></div>
                        </div>
                      </div>
                    </div>
                </draggable>
              </section>
            </div>
          </div>
          <div class="box-right-box b-bottom" v-if="seventhShow">
            <div class="box-right-box-left">
              <div class="center">
                <p>{{ $t('支付宝') }}</p>
                <el-select v-model="alipayQueue" @change="onOnlineEnd" :disabled="!permissions.edit">
                  <el-option :label="$t('排队')" :value="1"></el-option>
                  <el-option :label="$t('平铺')" :value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="box-right-box-middle">
              <section v-if="seventhShow">
            <draggable class="drag" v-model="onlineFifthListLeft" :options="!permissions.drag?disDragOption:dragOptions7" :move="onMove"  @change="onOnlineEnd">
                <div v-for="(item, index) in onlineFifthListLeft" :key="item.name" class="undraggable">
                  <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']" :ref="'ali' + index" @click="openPopover(item, 3, 1, 'ali' + index)">
                    <div class="first" v-show="item.depositAmount < item.dayMaxAmout">{{ $t('显示') }}</div>
                    <img :src="item.bankLogo">
                    <div class="ct">
                      <div>{{item.name}}</div>
                      <div><span :class="[item.depositAmount >= item.dayMaxAmout? 'red': 'green']">{{item.depositAmount}}</span>/<span :class="[item.depositAmount >= item.dayMaxAmout? 'red': '']">{{item.dayMaxAmout}}</span></div>
                    </div>
                  </div>
                </div>
            </draggable>
          </section>
            </div>
            <div class="box-right-box-right">
              <section>
                <draggable class="drag" v-model="onlineFifthListRight" :options="!permissions.drag?disDragOption:dragOptions7" :move="onMove">
                    <div v-for="item in onlineFifthListRight" :key="item.name" class="undraggable">
                      <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']">
                        <img :src="item.bankLogo">
                        <div class="ct">
                          <div>{{item.name}}</div>
                          <div><span>{{item.depositAmount}}</span>/<span>{{item.dayMaxAmout}}</span></div>
                        </div>
                      </div>
                    </div>
                </draggable>
              </section> 
            </div>
          </div>

          <div class="box-right-box b-bottom" v-if="numRmbShow">
            <div class="box-right-box-left">
              <div class="center">
                <p>{{ $t('数字人民币') }}</p>
                <el-select v-model="numRmbQueue" @change="onOnlineEnd" :disabled="!permissions.edit">
                  <el-option :label="$t('排队')" :value="1"></el-option>
                  <el-option :label="$t('平铺')" :value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="box-right-box-middle">
              <section v-if="numRmbShow">
                <draggable class="drag" v-model="onlineSeventhListLeft" :options="!permissions.drag?disDragOption:dragOptions8" :move="onMove"  @change="onOnlineEnd">
                  <div v-for="(item, index) in onlineSeventhListLeft" :key="item.name" class="undraggable">
                    <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']" :ref="'ali' + index" @click="openPopover(item, 3, 1, 'ali' + index)">
                      <div class="first" v-show="item.depositAmount < item.dayMaxAmout">{{ $t('显示') }}</div>
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.name}}</div>
                        <div><span :class="[item.depositAmount >= item.dayMaxAmout? 'red': 'green']">{{item.depositAmount}}</span>/<span :class="[item.depositAmount >= item.dayMaxAmout? 'red': '']">{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </section>
            </div>
            <div class="box-right-box-right">
              <section>
                <draggable class="drag" v-model="onlineSeventhListRight" :options="!permissions.drag?disDragOption:dragOptions8" :move="onMove">
                  <div v-for="item in onlineSeventhListRight" :key="item.name" class="undraggable">
                    <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']">
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.name}}</div>
                        <div><span>{{item.depositAmount}}</span>/<span>{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </section>
            </div>
          </div>

          <div class="box-right-box b-bottom" v-if="eezieShow">
            <div class="box-right-box-left">
              <div class="center">
                <p>{{ $t('EeziePay') }}</p>
                <el-select v-model="eezieQueue" @change="onOnlineEnd" :disabled="!permissions.edit">
                  <el-option :label="$t('排队')" :value="1"></el-option>
                  <el-option :label="$t('平铺')" :value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="box-right-box-middle">
              <section v-if="eezieShow">
                <draggable class="drag" v-model="onlineEighthListLeft" :options="!permissions.drag?disDragOption:dragOptions9" :move="onMove"  @change="onOnlineEnd">
                  <div v-for="(item, index) in onlineEighthListLeft" :key="item.name" class="undraggable">
                    <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']" :ref="'ali' + index" @click="openPopover(item, 3, 1, 'ali' + index)">
                      <div class="first" v-show="item.depositAmount < item.dayMaxAmout">{{ $t('显示') }}</div>
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.name}}</div>
                        <div><span :class="[item.depositAmount >= item.dayMaxAmout? 'red': 'green']">{{item.depositAmount}}</span>/<span :class="[item.depositAmount >= item.dayMaxAmout? 'red': '']">{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </section>
            </div>
            <div class="box-right-box-right">
              <section>
                <draggable class="drag" v-model="onlineEighthListRight" :options="!permissions.drag?disDragOption:dragOptions9" :move="onMove">
                  <div v-for="item in onlineEighthListRight" :key="item.name" class="undraggable">
                    <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']">
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.name}}</div>
                        <div><span>{{item.depositAmount}}</span>/<span>{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </section>
            </div>
          </div>

           <!-- 电子钱包 -->
          <div class="box-right-box b-bottom" v-if="elecShow">
            <div class="box-right-box-left">
              <div class="center">
                <p>{{ $t('电子钱包') }}</p>
                <el-select v-model="elecQueue" @change="onOnlineEnd" :disabled="!permissions.edit">
                  <el-option :label="$t('排队')" :value="1"></el-option>
                  <el-option :label="$t('平铺')" :value="0"></el-option>
                </el-select>
              </div>
            </div>

            <div class="box-right-box-middle">
              <section v-if="elecShow">
                <draggable class="drag" v-model="onlineNineListLeft" :options="!permissions.drag?disDragOption:dragOptions10" :move="onMove"  @change="onOnlineEnd">
                  <div v-for="(item, index) in onlineNineListLeft" :key="item.name" class="undraggable">
                    <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']" :ref="'ali' + index" @click="openPopover(item, 3, 1, 'ali' + index)">
                      <div class="first" v-show="item.depositAmount < item.dayMaxAmout">{{ $t('显示') }}</div>
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.name}}</div>
                        <div><span :class="[item.depositAmount >= item.dayMaxAmout? 'red': 'green']">{{item.depositAmount}}</span>/<span :class="[item.depositAmount >= item.dayMaxAmout? 'red': '']">{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </section>
            </div>
            <div class="box-right-box-right">
              <section>
                <draggable class="drag" v-model="onlineNineListRight" :options="!permissions.drag?disDragOption:dragOptions10" :move="onMove">
                  <div v-for="item in onlineNineListRight" :key="item.name" class="undraggable">
                    <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']">
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.name}}</div>
                        <div><span>{{item.depositAmount}}</span>/<span>{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </section>
            </div>
          </div>

          <!-- 钱包转账 -->
          <div class="box-right-box b-bottom" v-if="walleTrShow">
            <div class="box-right-box-left">
              <div class="center">
                <p>{{ $t('钱包转账') }}</p>
                <el-select v-model="walleTrQueue" @change="onOnlineEnd" :disabled="!permissions.edit">
                  <el-option :label="$t('排队')" :value="1"></el-option>
                  <el-option :label="$t('平铺')" :value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="box-right-box-middle">
              <section v-if="walleTrShow">
                <draggable class="drag" v-model="onlineTenListLeft" :options="!permissions.drag?disDragOption:dragOptions11" :move="onMove"  @change="onOnlineEnd">
                  <div v-for="(item, index) in onlineTenListLeft" :key="item.name" class="undraggable">
                    <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']" :ref="'ali' + index" @click="openPopover(item, 3, 1, 'ali' + index)">
                      <div class="first" v-show="item.depositAmount < item.dayMaxAmout">{{ $t('显示') }}</div>
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.name}}</div>
                        <div><span :class="[item.depositAmount >= item.dayMaxAmout? 'red': 'green']">{{item.depositAmount}}</span>/<span :class="[item.depositAmount >= item.dayMaxAmout? 'red': '']">{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </section>
            </div>
            <div class="box-right-box-right">
              <section>
                <draggable class="drag" v-model="onlineTenListRight" :options="!permissions.drag?disDragOption:dragOptions11" :move="onMove">
                  <div v-for="item in onlineTenListRight" :key="item.name" class="undraggable">
                    <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']">
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.name}}</div>
                        <div><span>{{item.depositAmount}}</span>/<span>{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </section>
            </div>
          </div>


          <div class="box-right-box b-bottom" v-if="ninethShow">
            <div class="box-right-box-left">
              <div class="center">
                <p>{{ $t('其他钱包') }}</p>
                <el-select v-model="otherpayQueue" @change="onOnlineEnd" :disabled="!permissions.edit">
                  <el-option :label="$t('排队')" :value="1"></el-option>
                  <el-option :label="$t('平铺')" :value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="box-right-box-middle">
              <section v-if="ninethShow">
                <draggable class="drag" v-model="onlineSixthListLeft" :options="!permissions.drag?disDragOption:dragOptions12" :move="onMove"  @change="onOnlineEnd">
                  <div v-for="(item, index) in onlineSixthListLeft" :key="item.name" class="undraggable">
                    <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']" :ref="'ali' + index" @click="openPopover(item, 3, 1, 'ali' + index)">
                      <div class="first" v-show="item.depositAmount < item.dayMaxAmout">{{ $t('显示') }}</div>
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.name}}</div>
                        <div><span :class="[item.depositAmount >= item.dayMaxAmout? 'red': 'green']">{{item.depositAmount}}</span>/<span :class="[item.depositAmount >= item.dayMaxAmout? 'red': '']">{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </section>
            </div>
            <div class="box-right-box-right">
              <section>
                <draggable class="drag" v-model="onlineSixthListRight" :options="!permissions.drag?disDragOption:dragOptions12" :move="onMove">
                  <div v-for="item in onlineSixthListRight" :key="item.name" class="undraggable">
                    <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']">
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.name}}</div>
                        <div><span>{{item.depositAmount}}</span>/<span>{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </section>
            </div>
          </div>
          
          <!-- TELCO PIN -->
          <div class="box-right-box b-bottom" v-if="telcoPinShow">
            <div class="box-right-box-left">
              <div class="center">
                <p>TELCO PIN</p>
                <el-select v-model="telcoPinQueue" @change="onOnlineEnd" :disabled="!permissions.edit">
                  <el-option :label="$t('排队')" :value="1"></el-option>
                  <el-option :label="$t('平铺')" :value="0"></el-option>
                </el-select>
              </div>
            </div>
            <div class="box-right-box-middle">
              <section v-if="telcoPinShow">
                <draggable class="drag" v-model="onlineElevenListLeft" :options="!permissions.drag?disDragOption:dragOptions13" :move="onMove"  @change="onOnlineEnd">
                  <div v-for="(item, index) in onlineElevenListLeft" :key="item.name" class="undraggable">
                    <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']" :ref="'ali' + index" @click="openPopover(item, 3, 1, 'ali' + index)">
                      <div class="first" v-show="item.depositAmount < item.dayMaxAmout">{{ $t('显示') }}</div>
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.name}}</div>
                        <div><span :class="[item.depositAmount >= item.dayMaxAmout? 'red': 'green']">{{item.depositAmount}}</span>/<span :class="[item.depositAmount >= item.dayMaxAmout? 'red': '']">{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </section>
            </div>
            <div class="box-right-box-right">
              <section>
                <draggable class="drag" v-model="onlineElevenListRight" :options="!permissions.drag?disDragOption:dragOptions13" :move="onMove">
                  <div v-for="item in onlineElevenListRight" :key="item.name" class="undraggable">
                    <div :class="['bank-card',!permissions.drag?'bank-card-nomove':'']">
                      <img :src="item.bankLogo">
                      <div class="ct">
                        <div>{{item.name}}</div>
                        <div><span>{{item.depositAmount}}</span>/<span>{{item.dayMaxAmout}}</span></div>
                      </div>
                    </div>
                  </div>
                </draggable>
              </section>
            </div>
          </div>

        </div>
      </div>
    </div>
    <popover v-if="showPopoverBool&&permissions.edit" @hide="closePopover" :bankData="itemData" :depositType='depositType' :contentType='contentType' :clientX='clientX' :clientY='clientY'></popover>
    <PopoverForAuto v-if="isPopoverForAutoShow&&permissions.edit" :clientX="clientX" :clientY="clientY" :deposits="depositsForAuto"
    :visible.sync="isPopoverForAutoShow&&permissions.edit" @submit="getAllotList" @hide="isPopoverForAutoShow=false"/>

    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
  </div>
</template>
<script>
  import systemConfig from '../../config/config.js'
  import draggable from 'vuedraggable'
  import popover from '../../components/Popover.vue'
  import PopoverForAuto from './PopoverForAuto'
  import { mapGetters } from 'vuex'

  import Mixin from '@/mixins/loadTime'


  export default {
    mixins: [Mixin],
    name: 'payAllocation',
    data () {
      return {
        netBankSort: {
          networkPay: {text:this.$t('网银支付'),isQueue:1},
          quickPay: {text:this.$t('快捷支付'),isQueue:1},
          qrcode: {text:this.$t('银联扫码'),isQueue:1},
          bankList: {text:this.$t('银行卡转卡'),isQueue:1},
        },
        depositAutoSort: {
          bankToggleBank: {text:this.$t('银行卡转卡'),isQueue:1},
          aliPayToggleBank: {text:this.$t('支付宝转卡'),isQueue:1},
          nuRmbToggleBank: {text:this.$t('数字人民币'),isQueue:1},
          elecToggleBank: {text:this.$t('电子钱包'),isQueue:1},
        },
        listGroup: [],
        minArrowIndex: 1,
        maxArrowIndex: '',
        arrowIndex: 1, // 第几行
        labelIndex: 0,
        maxAmount: '',
        labelWidth: '',
        groupId: 1,
        tier: 1,
        bankData: {dayMaxAmout: '', minAmout: '', maxAmout: ''},
        disDragOption:{//不让拖拽
          group:{name:'card-config',put:'clone','pull':'clone'},
          filter: '.undraggable',
          sort:true
        },
        dragOptions1: {
          animation: 0,
          group: "description1",
        },
        dragOptions2: {
          group: "description2",
        },
        dragOptionsQrcodePay: {
          group: "dragOptionsQrcodePay",
        },
        dragOptions3: {
          animation: 0,
          group: "description3",
        },
        dragOptions4: {
          group: "description4",
        },
        dragOptions5: {
          group: "description5",
        },
        dragOptions6: {
          group: {
            name: 'description6',
            // pull: ['networkPay', 'quickPay', 'qrcode'],
            put: ['networkPay', 'quickPay', 'qrcode', 'bankList']
          }
        },
        dragOptions7: {
          group: "description7",
        },
        dragOptions8: {
          group: "description8",
        },
        dragOptions9: {
          group: "description9",
        },
        dragOptions10: {
          group: "description10",
        },
        dragOptions11: {
          group: "description11",
        },
        dragOptions12: {
          group: "description12",
        },
        dragOptions13: {
          group: "description13",
        },
        lastPostData: [],
        itemData: {},
        depositType: '',
        contentType: '',
        clientX: '',
        clientY: '',
        showPopoverBool: false,
        depositsForAuto: [],
        isPopoverForAutoShow: false,
        isLoading: false,
        //排队或平铺
        crQueue:0,
        bankeQueue:1,
        qrcodeQueue:1,
        autoQueue:1,
        qqQueue:1,
        wechatQueue:1,
        jdQueue:1,
        netBankQueue:1,
        alipayQueue:1,
        otherpayQueue:1,
        numRmbQueue: 1,
        eezieQueue: 1,
        bankToggleBankQueue: 1,
        aliPayToggleBank: 1,
        elecQueue: 1,
        walleTrQueue: 1,
        telcoPinQueue: 1,
      }
    },
    components: {
      draggable, popover, PopoverForAuto
    },
    mounted () {
      this.getAllotList()
    },
    computed: {
      netBankSorter() {
        const sorter = {
          networkPay: [],
          quickPay: [],
          qrcode: [],
          bankList: []
        }
        this.onlineFouthListLeft.forEach(item => {
          switch(item.paymentType) {
            case 4:
              sorter.networkPay.push(item)
              break
            case 7:
              sorter.quickPay.push(item)
              break
            case 8:
              sorter.qrcode.push(item)
              break
            case 14:
              sorter.bankList.push(item)
              break
          }
        })
        return sorter
      },
      depositAutoSorter () {
        const sorter = {
          bankToggleBank: [],
          aliPayToggleBank: [],
          nuRmbToggleBank: [],
          elecToggleBank: []
        }
        this.depositAutoLeft.forEach(item => {
          switch(item.alipayFlg) {
            case '0':
              sorter.bankToggleBank.push(item)
              break
            case '1':
              sorter.aliPayToggleBank.push(item)
              break
            case '2':
              sorter.nuRmbToggleBank.push(item)
              break
            case '3':
              sorter.elecToggleBank.push(item)
              break
          }
        })
        return sorter
      },
      fullHeight () {
        if (this.tierArr.length === 1) {
          if (this.$refs.yinhang) {
            setTimeout(() => {
              return this.$refs['yinhang'].clientHeight
            }, 1000)
          }
        }
      },
      tierArr () {
        let newArr = []
        for(let i = 0; i < this.depositBankcardListLeft.length; i++) {
          newArr.push(Math.random())
        }
        if (newArr.length === 0) {
          newArr = [{}]
        }
        return newArr
      },
      // 每一行是否展示
      firstShow () {
        return this.depositBankcardListRight.length > 0 && this.depositBankcardListLeft.length > 0
      },
      qrcodesShow () {
        return this.qrCodesLeft.length > 0 || this.qrCodesRight.length > 0
      },
      crPayShow () {
        return this.crPayLeft.length > 0 || this.crPayRight.length > 0
      },
      secondShow () {
        return this.depositAutoLeft.length > 0 || this.depositAutoRight.length > 0
      },
      thirdShow () {
        return this.onlineFirstListLeft.length > 0 || this.onlineFirstListRight.length > 0
      },
      fourthShow () {
        return this.onlineSecondListLeft.length > 0 || this.onlineSecondListRight.length > 0
      },
      fifthShow () {
        return this.onlineThirdListLeft.length > 0 || this.onlineThirdListRight.length > 0
      },
      sixthShow () {
        return this.onlineFouthListLeft.length > 0 || this.onlineFouthListRight.length > 0
      },
      seventhShow () {
        return this.onlineFifthListLeft.length > 0 || this.onlineFifthListRight.length > 0
      },
      eighthShow () {
        return this.thirdShow || this.fourthShow || this.fifthShow || this.sixthShow || this.seventhShow
      },
      ninethShow () {
        return this.onlineSixthListLeft.length > 0 || this.onlineSixthListRight.length > 0
      },
      numRmbShow () {
        return this.onlineSeventhListLeft.length > 0 || this.onlineSeventhListRight.length > 0
      },
      eezieShow () {
        return this.onlineEighthListLeft.length > 0 || this.onlineEighthListRight.length > 0
      },
      elecShow () {
        return this.onlineNineListLeft.length > 0 || this.onlineNineListRight.length > 0
      },
      walleTrShow () {
        return this.onlineTenListLeft.length > 0 || this.onlineTenListRight.length > 0
      },
      telcoPinShow () {
        return this.onlineElevenListLeft.length > 0 || this.onlineElevenListRight.length > 0
      },
      renderGroup () {
        if (this.listGroup.length > 0) {
          return this.listGroup.slice((this.arrowIndex - 1) * this.maxAmount, this.arrowIndex * this.maxAmount)
        }
        return []
      },
      crPayLeft: {
        get () {
          return this.$store.state.crPayLeft
        },
        set (value) {
          this.$store.commit('updateCrPayLeft', value)
        }
      },
      crPayRight: {
        get () {
          return this.$store.state.crPayRight
        },
        set (value) {
          this.$store.commit('updateCrPayRight', value)
        }
      },
      depositBankcardListLeft: {
        get () {
          return this.$store.state.depositBankcardListLeft
        },
        set (value) {
          this.$store.commit('updateDepositBankcardListLeft', value)
        }
      },
      depositBankcardListRight: {
        get () {
          return this.$store.state.depositBankcardListRight
        },
        set (value) {
          this.$store.commit('updateDepositBankcardListRight', value)
        }
      },
      depositAutoLeft: {
        get () {
          return this.$store.state.depositAutoLeft
        },
        set (value) {
          this.$store.commit('updateDepositAutoLeft', value)
        }
      },
      depositAutoRight: {
        get () {
          return this.$store.state.depositAutoRight
        },
        set (value) {
          this.$store.commit('updateDepositAutoRight', value)
        }
      },
      qrCodesLeft: {
        get () {
          return this.$store.state.qrCodesLeft
        },
        set (value) {
          this.$store.commit('updateQrCodesLeft', value)
        }
      },
      qrCodesRight: {
        get () {
          return this.$store.state.qrCodesRight
        },
        set (value) {
          this.$store.commit('updateQrCodesRight', value)
        }
      },
      onlineFirstListLeft: {
        get () {
          let arr=this.$store.state.onlineFirstListLeft
          arr.map(item=>{
            item.isQueue=this.qqQueue;
          })
          return arr
        },
        set (value) {
          this.$store.commit('updateOnlineFirstListLeft', value)
        }
      },
      onlineFirstListRight: {
        get () {
          return this.$store.state.onlineFirstListRight
        },
        set (value) {
          this.$store.commit('updateOnlineFirstListRight', value)
        }
      },
      onlineSecondListLeft: {
        get () {
          let arr=this.$store.state.onlineSecondListLeft
          arr.map(item=>{
            item.isQueue=this.wechatQueue
          })
          return arr
        },
        set (value) {
          this.$store.commit('updateOnlineSecondListLeft', value)
        }
      },
      onlineSecondListRight: {
        get () {
          return this.$store.state.onlineSecondListRight
        },
        set (value) {
          this.$store.commit('updateOnlineSecondListRight', value)
        }
      },
      onlineThirdListLeft: {
        get () {
          let arr=this.$store.state.onlineThirdListLeft
          arr.map(item=>{
            item.isQueue=this.jdQueue
          })
          return arr
        },
        set (value) {
          this.$store.commit('updateOnlineThirdListLeft', value)
        }
      },
      onlineThirdListRight: {
        get () {
          return this.$store.state.onlineThirdListRight
        },
        set (value) {
          this.$store.commit('updateOnlineThirdListRight', value)
        }
      },
      onlineFouthListLeft: {
        get () {
          return this.$store.state.onlineFouthListLeft
        },
        set (value) {
          this.$store.commit('updateOnlineFouthListLeft', value)
        }
      },
      onlineFouthListRight: {
        get () {
          return this.$store.state.onlineFouthListRight
        },
        set (value) {
          this.$store.commit('updateOnlineFouthListRight', value)
        }
      },
      onlineFifthListLeft: {
        get () {
          let arr=this.$store.state.onlineFifthListLeft
          arr.map(item=>{
            item.isQueue=this.alipayQueue
          })
          return arr
        },
        set (value) {
          this.$store.commit('updateOnlineFifthListLeft', value)
        }
      },
      onlineFifthListRight: {
        get () {
          return this.$store.state.onlineFifthListRight
        },
        set (value) {
          this.$store.commit('updateOnlineFifthListRight', value)
        }
      },
      onlineSixthListLeft: {
        get () {
          let arr=this.$store.state.onlineSixthListLeft
          arr.map(item=>{
            item.isQueue=this.otherpayQueue
          })
          return arr
        },
        set (value) {
          this.$store.commit('updateOnlineSixthListLeft', value)
        }
      },
      onlineSixthListRight: {
        get () {
          return this.$store.state.onlineSixthListRight
        },
        set (value) {
          this.$store.commit('updateOnlineSixthListRight', value)
        }
      },
      // 线上支付 - 数字人民币
      onlineSeventhListLeft: {
        get () {
          let arr=this.$store.state.onlineSeventhListLeft
          arr.map(item=>{
            item.isQueue=this.numRmbQueue
          })
          return arr
        },
        set (value) {
          this.$store.commit('updateOnlineSeventhListLeft', value)
        }
      },
      onlineSeventhListRight: {
        get () {
          return this.$store.state.onlineSeventhListRight
        },
        set (value) {
          this.$store.commit('updateOnlineSeventhListRight', value)
        }
      }, //  线上支付 - 数字人民币
      // 线上支付 - eeziepay
      onlineEighthListLeft: {
        get () {
          let arr=this.$store.state.onlineEighthListLeft
          arr.map(item=>{
            item.isQueue=this.eezieQueue
          })
          return arr
        },
        set (value) {
          this.$store.commit('updateOnlineEighthListLeft', value)
        }
      },
      onlineEighthListRight: {
        get () {
          return this.$store.state.onlineEighthListRight
        },
        set (value) {
          this.$store.commit('updateOnlineEighthListRight', value)
        }
      },
      // 电子钱包
      onlineNineListLeft: {
        get () {
          let arr=this.$store.state.onlineNineListLeft
          arr.map(item=>{
            item.isQueue=this.elecQueue
          })
          return arr
        },
        set (value) {
          this.$store.commit('updateOnlineNineListLeft', value)
        }
      },
      onlineNineListRight: {
        get () {
          return this.$store.state.onlineNineListRight
        },
        set (value) {
          this.$store.commit('updateOnlineNineListRight', value)
        }
      },
      // 钱包转账
      onlineTenListLeft: {
        get () {
          let arr=this.$store.state.onlineTenListLeft
          arr.map(item=>{
            item.isQueue=this.walleTrQueue
          })
          return arr
        },
        set (value) {
          this.$store.commit('updateOnlineTenListLeft', value)
        }
      },
      onlineTenListRight: {
        get () {
          return this.$store.state.onlineTenListRight
        },
        set (value) {
          this.$store.commit('updateOnlineTenListRight', value)
        }
      },
      //Telco Pin
      onlineElevenListLeft: {
        get () {
          let arr=this.$store.state.onlineElevenListLeft
          arr.map(item=>{
            item.isQueue=this.telcoPinQueue
          })
          return arr
        },
        set (value) {
          this.$store.commit('updateOnlineElevenListLeft', value)
        }
      },
      onlineElevenListRight: {
        get () {
          return this.$store.state.onlineElevenListRight
        },
        set (value) {
          this.$store.commit('updateOnlineElevenListRight', value)
        }
      },
      permissions() {
        const { hasPermission } = this
        return {
          edit: hasPermission('setting:allot:updateQuota'),
          drag:hasPermission('setting:allot:update')
        }
      },
      ...mapGetters(['hasPermission'])
    },
    methods: {
      openPopoverForAuto (deposits, who) {
        if (!this.hasPermission('setting:allot:updateQuota')) {
          return
        }
        this.showPopoverBool = false
        this.isPopoverForAutoShow = false
        this.clientX = this.$refs[who][0].offsetLeft + this.$refs[who][0].offsetWidth + 30
        this.clientY = this.$refs[who][0].offsetTop - 20
        this.depositsForAuto = deposits
        this.$nextTick(() => {
          this.isPopoverForAutoShow = true
        })
      },
      closePopover (flag) {
        this.showPopoverBool = false
        if (flag === 'update') {
          this.getAllotList()
        }
      },
      openPopover (bankData,depositType,contentType,who) {
        if (!this.hasPermission('setting:allot:updateQuota')) {
          return
        }
        this.showPopoverBool = false
        this.isPopoverForAutoShow = false
        this.itemData = bankData
        this.depositType = depositType
        this.contentType = contentType
        this.clientX = this.$refs[who][0].offsetLeft + this.$refs[who][0].offsetWidth + 30
        this.clientY = this.$refs[who][0].offsetTop - 20
        this.$nextTick(() => {
          this.showPopoverBool = true
        })
      },
      // type限额类型 1银行卡转账 2自动入款平台 3线上支付
      showPopover (item, type) {
        let tempObj = Object.assign({}, item)
        this.bankData.quotaType = type
        this.bankData.id = tempObj.id
        this.bankData.dayMaxAmout = tempObj.dayMaxAmout
        this.bankData.minAmout = tempObj.minAmout
        this.bankData.maxAmout = tempObj.maxAmout
      },
      addDeposit () {
        for (let i = 0; i< this.tierArr.length; i++) {
          if (this.depositBankcardListLeft[i] && this.depositBankcardListLeft[i].length === 0) {
            this.$message({
              type: 'warning',
              message: this.$t('某一栏的数据不能为空')
            })
            return
          }
        }
        this.depositBankcardListLeft.push([])
        this.$store.commit('updateDepositBankcardListLeft', this.depositBankcardListLeft)
      },
      deleteDeposit (index) {
        this.$store.commit('updateDepositBankcardListRight', [...this.depositBankcardListLeft[index], ...this.depositBankcardListRight])
        this.depositBankcardListLeft.splice(index, 1)
        this.$store.commit('updateDepositBankcardListLeft', this.depositBankcardListLeft)
        this.onDepositEnd()
      },
      onDepositEnd () {
        let postData = []
        this.$store.commit('updateDepositBankcardListLeft', this.depositBankcardListLeft)
        this.depositBankcardListLeft.forEach((arr, index) => {
          arr.forEach((item, sort) => {
            postData.push({depositId: item.id, groupId: this.groupId, tier: index + 1, isQueue:this.bankeQueue,sort})
          })
        })
        if (postData.length === 0) {
          this.$axios.post(systemConfig.urls.updateBankSort, {groupId: this.groupId}).then((res) => {
          })
        } else {
          if (this.compareArray(this.lastPostData, postData)) return
          this.lastPostData = postData
          this.$axios.post(systemConfig.urls.updateBankSort, {groupId: this.groupId, sysDepMbrs: postData}).then((res) => {
            // this.$message({
            //   type: 'success',
            //   message: '数据更新操作成功'
            // })
          })
        }
      },
      onCrEnd(){
        const crPayGroups = this.crPayLeft.map((item, index) => {
          return {
            sort: index,
            currenciesId: item.id,
            groupId: this.groupId,
            isQueue:this.crQueue,
          }
        })
        this.$axios.post(systemConfig.urls.updateCrSort, {groupId: this.groupId, crPayGroups}).then((res) => {
          // this.$message({
          //   type: 'success',
          //   message: '数据更新操作成功'
          // })
        })
      },
      onAutoEnd(){
        let arr = []
        for (let i in this.depositAutoSorter) {
          arr = [...arr, ...this.depositAutoSorter[i]]
        }
        const toggleBankArr = ['bankToggleBank', 'aliPayToggleBank', 'nuRmbToggleBank', 'elecToggleBank']
        arr.map(val=>{
          val.isQueue = this.depositAutoSort[toggleBankArr[val.alipayFlg]].isQueue
        })
        this.depositAutoLeft = arr
        const fastPayGroups = this.depositAutoLeft.map((item, index) => {
          return {
            sort: index,
            fastPayId: item.id,
            groupId: this.groupId,
            isQueue: item.isQueue,
          }
        })
        this.$axios.post(systemConfig.urls.updateAutoSort, {groupId: this.groupId, fastPayGroups})
      },
      onQrcodeEnd(){
        const qrCodePayGroups = this.qrCodesLeft.map((item, index) => {
          return {
            sort: index,
            qrCodeId: item.id,
            groupId: this.groupId,
            isQueue:this.qrcodeQueue,
          }
        })
        this.$axios.post(systemConfig.urls.updateQrCodeSort, {groupId: this.groupId, qrCodePayGroups}).then((res) => {
          // this.$message({
          //   type: 'success',
          //   message: '数据更新操作成功'
          // })
        })
      },
      onNetBankEnd() {
        let arr = []
        for (let i in this.netBankSorter) {
          arr = [...arr, ...this.netBankSorter[i]]
        }
        arr.map(val=>{
          if(val.paymentType==4){
            val.isQueue=this.netBankSort.networkPay.isQueue
          }else if(val.paymentType==7){
            val.isQueue=this.netBankSort.quickPay.isQueue
          }else if(val.paymentType==8){
            val.isQueue=this.netBankSort.qrcode.isQueue
          } else if(val.paymentType==14) {
            val.isQueue = this.netBankSort.bankList.isQueue
          }
        })
        this.onlineFouthListLeft = arr
        this.onOnlineEnd()
      },
      onOnlineEnd () {
        let postData = []
        let arr = [
                    this.onlineFirstListLeft,
                    this.onlineSecondListLeft,
                    this.onlineThirdListLeft,
                    this.onlineFouthListLeft,
                    this.onlineFifthListLeft,
                    this.onlineSixthListLeft,
                    this.onlineSeventhListLeft,
                    this.onlineEighthListLeft,
                    this.onlineNineListLeft,
                    this.onlineTenListLeft,
                    this.onlineElevenListLeft,
                  ]
        arr.map((val) => {
          if (val.length > 0) {
            val.map((item,index) => {
              // available字段是为了该卡放到最后用的
              let obj = {onlinePayId: item.id, groupId: this.groupId, sort: index, isQueue: item.isQueue ,available: item.depositAmount > item.dayMaxAmout}
              postData.push(obj)
            })
          }
        })
        this.$axios.post(systemConfig.urls.updateOnlineSort, {groupId: this.groupId, onlineGroups: postData}).then((res) => {
          // this.$message({
          //   type: 'success',
          //   message: '数据更新操作成功'
          // })
        })
      },
      getAllotList () {
        this.getCurrentRecodeTime()
        this.isLoading = true
        this.$axios.get(systemConfig.urls.getAllotListByGroupId, {
          params: {
            groupId: this.groupId
          }
        })
          .then(resp => {
            this.getNetworkLoadAndDataSolveTime(resp)
            this.isLoading = false
            this.listGroup = resp.data.data
            let listLength = resp.data.data.length // 一共多少个
            this.labelWidth = this.$refs.labelWidth.clientWidth
            this.maxAmount = Math.floor(this.labelWidth / 100) // 一排放几个label
            if (listLength > 0) {
              this.maxArrowIndex = Math.ceil(listLength / this.maxAmount)
              this.storeDepositBankcardList()
              this.storeOnlineBankcardList()
              this.storeAutoBankcardList()
              this.storeQrcodesList()
              this.storeCrPayList()
            }
          })
      },
      moveLeft () {
        this.labelIndex = 0
        this.arrowIndex--
        this.getAllotList()
      },
      moveRight () {
        this.labelIndex = 0
        this.arrowIndex++
        this.getAllotList()
      },
      labelClick (index) {
        this.labelIndex = index
        this.groupId = this.listGroup[this.labelIndex + (this.arrowIndex - 1) * this.maxAmount].groupId
        this.getAllotList()
      },
      onMove({ relatedContext, draggedContext }) {
        const relatedElement = relatedContext.element;
        const draggedElement = draggedContext.element;
        return (
          (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
        )
      },
      sortItems(arr){// 根据sort和每日限额是否达到上限排序
        const availableArr = []
        const disabledArr = []
        for (let i = 0;i < arr.length;i++) {
          let item = arr[i]
          if (item.depositAmount < item.dayMaxAmout) {
            availableArr.push(item)
          } else {
            disabledArr.push(item)
          }
        }
        return [...availableArr.sort((a, b) => {return a.sort - b.sort}), ...disabledArr.sort((a, b) => {return a.sort - b.sort})]
      },
      storeCrPayList () {
        const currentTabData = this.listGroup[this.labelIndex + (this.arrowIndex - 1) * this.maxAmount]
        if (currentTabData) {
          const rightArr = currentTabData.payListDto.rightCr || []
          const leftArr = currentTabData.payListDto.leftCr || []
          this.crQueue = leftArr.length?leftArr[0].isQueue:this.crQueue;
          //去掉排序
          // this.$store.commit('updateCrPayLeft', this.sortItems(leftArr))
          this.$store.commit('updateCrPayLeft', leftArr)
          this.$store.commit('updateCrPayRight', rightArr)
        }
      },
      storeQrcodesList () {
        const currentTabData = this.listGroup[this.labelIndex + (this.arrowIndex - 1) * this.maxAmount]
        if (currentTabData) {
          const rightArr = currentTabData.payListDto.rightQrCodes || []
          const leftArr = currentTabData.payListDto.leftQrCodes || []
          this.qrcodeQueue = leftArr.length?leftArr[0].isQueue:this.qrcodeQueue;
          //去掉排序
          // this.$store.commit('updateQrCodesLeft', this.sortItems(leftArr))
          this.$store.commit('updateQrCodesLeft', leftArr)
          this.$store.commit('updateQrCodesRight', rightArr)
        }
      },
      storeAutoBankcardList () {
        const currentTabData = this.listGroup[this.labelIndex + (this.arrowIndex - 1) * this.maxAmount]
        if (currentTabData) {
          const rightArr = currentTabData.payListDto.rightFastPay || []
          const leftArr = currentTabData.payListDto.leftFastPays || []
          leftArr.map(item => {
            switch (item.alipayFlg) {
              case '0':
                this.depositAutoSort.bankToggleBank.isQueue = item.isQueue
                break
              case '1':
                this.depositAutoSort.aliPayToggleBank.isQueue = item.isQueue
                break
              case '2':
                this.depositAutoSort.nuRmbToggleBank.isQueue = item.isQueue
                break
              case '3':
                this.depositAutoSort.elecToggleBank.isQueue = item.isQueue
                break
            }
          })
          //去掉排序
          // this.$store.commit('updateDepositAutoLeft', this.sortItems(leftArr))
          this.$store.commit('updateDepositAutoLeft', leftArr)
          this.$store.commit('updateDepositAutoRight', rightArr)
        }
      },
      storeDepositBankcardList () {
        if (this.listGroup.length > 0 && this.listGroup[this.labelIndex + (this.arrowIndex - 1) * this.maxAmount].payListDto) {
          // 改造leftlist  按照tier分组
          let index = 0
          let leftArr = []
          let tierNumArr = []
          let originArr = this.listGroup[this.labelIndex + (this.arrowIndex - 1) * this.maxAmount].payListDto.leftDeposits
          if (originArr.length === 0) {
            tierNumArr = [0]
            leftArr = [[]]
          } else {
            originArr.map((item) => {
              tierNumArr.push(item.tier)
            })
          }
          let maxLength = tierNumArr.sort((a,b) =>{return b - a})[0]
          while (index < maxLength) {
            const arr = []
            originArr.forEach((item) => {
              if (item.tier === index + 1) {
                arr.push(item)
              }
            })
            index ++
            //去掉排序
            // leftArr.push(this.sortItems(arr))
            leftArr.push(arr)
            this.bankeQueue =leftArr[0][0].isQueue
          }
          this.$store.commit('updateDepositBankcardListLeft', leftArr)
          this.$store.commit('updateDepositBankcardListRight', this.listGroup[this.labelIndex + (this.arrowIndex - 1) * this.maxAmount].payListDto.rightDeposits)
        }
      },
      storeOnlineBankcardList () {
        // payments: [{id: 1, label: 'QQ'},{id: 2, label: '微信'},{id: 3, label: '京东'},{id: 4, label: '网银'},{id: 5, label: '支付宝'}],
        if (this.listGroup.length > 0 && this.listGroup[this.labelIndex + (this.arrowIndex - 1) * this.maxAmount].payListDto) {
          if (this.listGroup[this.labelIndex + (this.arrowIndex - 1) * this.maxAmount].payListDto.leftOnlinepays.length > 0) {
            let qqArr = []
            let wechatArr = []
            let JDArr = []
            let WYArr = []
            let alipayArr = []
            let otherArr = []
            let numRmbArr = []
            let eezieArr = []
            let elecArr = []
            let walleTrArr = []
            let telcoPinTrArr = []
            this.listGroup[this.labelIndex + (this.arrowIndex - 1) * this.maxAmount].payListDto.leftOnlinepays.map((item) => {
              switch (item.paymentType) {
                case 1:
                  qqArr.push(item)
                  this.qqQueue=qqArr[0].isQueue
                  break
                case 2:
                  wechatArr.push(item)
                  this.wechatQueue=wechatArr[0].isQueue
                  break
                case 3:
                  JDArr.push(item)
                  this.jdQueue=JDArr[0].isQueue
                  break
                case 4: //网银
                  WYArr.push(item)
                  this.netBankSort.networkPay.isQueue=item.isQueue
                  break
                case 7: //快捷支付
                  WYArr.push(item)
                  this.netBankSort.quickPay.isQueue=item.isQueue
                  break
                case 8: //银联扫码
                  WYArr.push(item)
                  this.netBankSort.qrcode.isQueue=item.isQueue
                  break
                case 14: //银行卡转卡
                  WYArr.push(item)
                  this.netBankSort.bankList.isQueue=item.isQueue
                  break
                case 5:
                  alipayArr.push(item)
                  this.alipayQueue=alipayArr[0].isQueue
                  break
                case 17: //ebpay
                case 18: //toPay
                case 26: // goPay
                  otherArr.push(item)
                  this.otherpayQueue=otherArr[0].isQueue
                  break
                case 20: // 数字人民币
                  numRmbArr.push(item)
                  this.numRmbQueue=numRmbArr[0].isQueue
                  break
                case 21: // eeziePay
                  eezieArr.push(item)
                  this.eezieQueue=eezieArr[0].isQueue
                  break
                case 23: // 电子钱包
                  elecArr.push(item)
                  this.elecQueue=elecArr[0].isQueue
                  break
                case 22: // 钱包转账
                  walleTrArr.push(item)
                  this.walleTrQueue=walleTrArr[0].isQueue
                  break
                case 27: // TELCO PIN
                  telcoPinTrArr.push(item)
                  this.telcoPinQueue=telcoPinTrArr[0].isQueue
                  break
              }
            })
            //去掉排序
            // this.$store.commit('updateOnlineFirstListLeft', this.sortItems(qqArr))
            // this.$store.commit('updateOnlineSecondListLeft', this.sortItems(wechatArr))
            // this.$store.commit('updateOnlineThirdListLeft', this.sortItems(JDArr))
            // this.$store.commit('updateOnlineFouthListLeft', this.sortItems(WYArr))
            // this.$store.commit('updateOnlineFifthListLeft', this.sortItems(alipayArr))
            this.$store.commit('updateOnlineFirstListLeft', qqArr)
            this.$store.commit('updateOnlineSecondListLeft', wechatArr)
            this.$store.commit('updateOnlineThirdListLeft', JDArr)
            this.$store.commit('updateOnlineFouthListLeft', WYArr)
            this.$store.commit('updateOnlineFifthListLeft', alipayArr)
            this.$store.commit('updateOnlineSixthListLeft', otherArr)
            this.$store.commit('updateOnlineSeventhListLeft', numRmbArr)
            this.$store.commit('updateOnlineEighthListLeft', eezieArr)
            this.$store.commit('updateOnlineNineListLeft', elecArr)
            this.$store.commit('updateOnlineTenListLeft', walleTrArr)
            this.$store.commit('updateOnlineElevenListLeft', telcoPinTrArr)
          } else {
            this.$store.commit('updateOnlineFirstListLeft', [])
            this.$store.commit('updateOnlineSecondListLeft', [])
            this.$store.commit('updateOnlineThirdListLeft', [])
            this.$store.commit('updateOnlineFouthListLeft', [])
            this.$store.commit('updateOnlineFifthListLeft', [])
            this.$store.commit('updateOnlineSixthListLeft', [])
            this.$store.commit('updateOnlineSeventhListLeft', [])
            this.$store.commit('updateOnlineEighthListLeft', [])
            this.$store.commit('updateOnlineNineListLeft', [])
            this.$store.commit('updateOnlineTenListLeft', [])
            this.$store.commit('updateOnlineElevenListLeft', [])
          }


          if (this.listGroup[this.labelIndex + (this.arrowIndex - 1) * this.maxAmount].payListDto.rightOnlinepays.length > 0) {
            let arr1 = []
            let arr2 = []
            let arr3 = []
            let arr4 = []
            let arr5 = []
            let arr6 = []
            let arr7 = []
            let arr8 = []
            let arr9 = []
            let arr10 = []
            let arr11 = []
            this.listGroup[this.labelIndex + (this.arrowIndex - 1) * this.maxAmount].payListDto.rightOnlinepays.map((item) => {
              switch (item.paymentType) {
                case 1:
                  arr1.push(item)
                  break
                case 2:
                  arr2.push(item)
                  break
                case 3:
                  arr3.push(item)
                  break
                case 4:
                  arr4.push(item)
                  break
                case 7:
                  arr4.push(item)
                  break
                case 8:
                  arr4.push(item)
                  break
                case 14:
                  arr4.push(item)
                  break
                case 5:
                  arr5.push(item)
                  break
                case 17:
                case 18:
                case 26:
                  arr6.push(item)
                  break
                case 20:
                  arr7.push(item)
                  break
                case 21:
                  arr8.push(item)
                  break
                case 23:
                  arr9.push(item)
                  break
                case 24:
                  arr10.push(item)
                  break
                case 27:
                  arr11.push(item)
                  break
              }
            })
            this.$store.commit('updateOnlineFirstListRight', arr1)
            this.$store.commit('updateOnlineSecondListRight', arr2)
            this.$store.commit('updateOnlineThirdListRight', arr3)
            this.$store.commit('updateOnlineFouthListRight', arr4)
            this.$store.commit('updateOnlineFifthListRight', arr5)
            this.$store.commit('updateOnlineSixthListRight', arr6)
            this.$store.commit('updateOnlineSeventhListRight', arr7)
            this.$store.commit('updateOnlineEighthListRight', arr8)
            this.$store.commit('updateOnlineNineListRight', arr9)
            this.$store.commit('updateOnlineTenListRight', arr10)
            this.$store.commit('updateOnlineElevenListRight', arr11)
          } else {
            this.$store.commit('updateOnlineFirstListRight', [])
            this.$store.commit('updateOnlineSecondListRight', [])
            this.$store.commit('updateOnlineThirdListRight', [])
            this.$store.commit('updateOnlineFouthListRight', [])
            this.$store.commit('updateOnlineFifthListRight', [])
            this.$store.commit('updateOnlineSixthListRight', [])
            this.$store.commit('updateOnlineSeventhListRight', [])
            this.$store.commit('updateOnlineEighthListRight', [])
            this.$store.commit('updateOnlineNineListRight', [])
            this.$store.commit('updateOnlineTenListRight', [])
            this.$store.commit('updateOnlineElevenListRight', [])
          }
        }
      },
      compareArray(a, b) {
        if (a.length !== b.length) {
          return false;
        }
        const length = a.length;
        for (let i = 0; i < length; i++) {
          if (!this.compare(a[i], b[i])) {
            return false;
          }
        }
        return true;
      },
      compare(a, b) {
        if (a === b) {
          return true;
        }
        if (typeof a !== typeof b || a === null || b === null) {
          return false;
        }
        if (Array.isArray(a)) {
          if (!Array.isArray(b)) {
            return false;
          }
          return this.compareArray(a, b);
        }
        if (typeof a === "object") {
          return this.compareObject(a, b);
        }
        return false;
      },
      compareObject(a, b) {
        const keya = Object.keys(a);
        const keyb = Object.keys(b);
        if (keya.length !== keyb.length) {
          return false;
        }
        return keya.every(key => {
          if (!this.compare(a[key], b[key])) {
            return false;
          }
          return true;
        });
      }
    }
   }
</script>
<style lang="scss">
.label-box {
  width: 100%;
  .icon-label-left, .icon-label-right {
    position:absolute;
    top: 0;
    height: 36px;
    line-height: 40px;
    z-index: 10;
    font-size: 14px;
    width: 22px;
    color: #909399;
    background: #fff;
  }
  .icon-label-left {
    left: -20px
  }
  .icon-label-right {
    right: 0
  }
  .label-container {
    width: 100%;
    // border-bottom: 1px solid #989889;
    .label-list {
      .label-list-li {
        position: relative;
        // width: 100px;
        padding: 0 20px;
        text-align: center;
        display: inline-block;
        cursor: pointer;
        line-height: 40px;
        &::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 100%;
          height: 2px;
          background-color: #e4e7ed;
          z-index: -1;
        }
      }
      .active {
        border-bottom: 2px solid #409eff;
        color:#409eff;
      }
    }
  }
}
.bank-card-box {
  margin-top: 20px;
  .box {
    display: flex;
    border: 1px solid #d3d3d3;
    border-bottom: none;
    .box-left {
      flex: 1;
      display:flex;
      justify-content: center;
      align-items: center;
      border-right: 1px solid #d3d3d3!important;
    }
    .box-right {
      flex: 15;
      display: flex;
      flex-direction: column;
      .box-right-box {
        flex: auto;
        display: flex;
        .box-right-box-left {
          flex: 1;
          //display:flex;
          //justify-content: center;
          //align-items: center;
          text-align: center;
          border-right: 1px solid #d3d3d3!important;
          .center{
            position: relative;
            top:50%;
            transform: translateY(-50%);
            p{
              margin-bottom: 8px;
            }
            /deep/ .el-input{
              width: 80%;
              margin: 0 auto;
            }
          }
        }
        .box-up {
          flex-direction: column;
        }
        .box-right-box-middle {
          flex: 7;
          display:flex;
          flex-wrap: wrap;
          border-right: 1px solid #d3d3d3!important;
          section {
            width: 100%;
          }
          .box-right-box-middle-drag {
            // position: relative;
            display: flex;
            flex-direction: row;
            flex: auto;
            width:100%;
            &.add-bank-display {
              padding: 14px 0;
              line-height: 18px;
              font-size: 14px !important;
              color: #59a6ff;
              display: flex;
              justify-content: center;
              span {
                cursor: pointer;
              }
            }
            .el-icon-circle-plus-outline, .el-icon-remove {
              float: right;
              font-size: 20px;
              color: #59a6ff;
              cursor: pointer;
            }
            .number {
              flex: 1;
              border-right: 1px solid #d3d3d3;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #999;
              text-align: center;
              &.netBank {
                flex: 3;
                p{
                  margin-bottom: 5px;
                }
                /deep/ .el-input{
                  width: 80%;
                  margin: 0 auto;
                }
              }
            }
            &:after {clear:both;content:'.'; display:block; width: 0;height: 0; visibility:hidden;}
          }
        }
        .box-right-box-right {
          flex: 7;
          background: #f8f8f8;
          color: #999;
          display:flex;
          flex-wrap: wrap;
          .bank-card {
            img {
              filter: grayscale(100%);
              filter: gray;
            }
          }
        }
      }
    }
  }
}
.fc {
  justify-content: center;
  align-items: center;
}
.b-bottom {
  border-bottom: 1px solid #d3d3d3!important;
}
.b-top {
  border-top: 1px solid #d3d3d3!important;
}
.b-left {
  border-left: 1px solid #d3d3d3!important;
}
.b-right {
  border-right: 1px solid #d3d3d3!important;
}
.bank-card{
  position: relative;
  width: 164px;
  height: 48px;
  box-shadow: 2px 2px 2px 2px #d3d3d3;
  margin: 4px;
  border-radius: 3px;
  cursor: move;
  img {
    position: absolute;
    left: 10px;
    width: 36px;
    top: 50%;
    transform: translateY(-50%);
  }
  .first {
    position: absolute;
    right:0;
    top: 0;
    width: 24px;
    height: 14px;
    color: #fff;
    padding: 4px 7px;
    background: #7ebe50;
    border-radius: 3px;
    text-align: center;
  }
  .ct {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 50px;
    line-height: 1.4;
  }
}
.bank-card-nomove{
  cursor: default
}
.drag{
  flex: 20;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 0 30px;
  min-height: 60px;
}
.bank-p {
  line-height: 20px
}
.bank-input {
  width: calc(40% - 6px);
  border: 1px solid #d3d3d3;
  border-radius: 3px;
  line-height: 22px;
  box-sizing: border-box;
  padding-left: 6px;
}
.max-input  {
  width: calc(100% - 6px);
}
.bank-span {
  width: calc(20% + 6px);
  display: inline-block;
  text-align: center;
}
.bank-button {
  text-align: right;
  margin-top: 6px;
}
.box1 {
  height: 30px;
  background: #f6f7f8;
}
.height60 {
  height: 60px;
}
.ali-popover {
  width: 260px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  padding: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  line-height: 1.4;
  position: absolute;
  background: #fff;
  .change-btn {
    text-align: right;
  }
}
</style>
