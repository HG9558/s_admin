<template>
  <!-- 投注记录 -->
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('全部游戏')" name="first"></el-tab-pane>
      <el-tab-pane :label="$t('真人视讯')" name="second"></el-tab-pane>
      <el-tab-pane :label="$t('电子游艺')" name="third"></el-tab-pane>
      <el-tab-pane :label="$t('体育赛事')" name="fourth"></el-tab-pane>
      <el-tab-pane :label="$t('彩票')" name="fifth"></el-tab-pane>
      <el-tab-pane :label="$t('捕鱼')" name="six"></el-tab-pane>
      <el-tab-pane :label="$t('棋牌')" name="seven"></el-tab-pane>
      <el-tab-pane :label="$t('电竞')" name="eight"></el-tab-pane>
      <el-tab-pane :label="$t('小费')" name="night"></el-tab-pane>
      <el-tab-pane :label="$t('斗鸡')" name="ten"></el-tab-pane>
    </el-tabs>
    <div class="bet-record">
      <div class="search" :class="searchClass">
        <div class="search-basic clearfix" style="overflow: visible">
          <!--派彩时间 -->
          <div class="search-basic-item">
            <div style="height: 20px">
              <label>{{ $t('派彩时间') }}</label>
            </div>
            <StartAndEndTimeSelectorTwo
              ref="payOutTime"
              :width="460"
              :startTime.sync="payOutStartTime"
              :endTime.sync="payOutEndTime"
              :selections="selectionsArr"
            />
          </div>
          <!--投注时间 -->
          <div class="search-basic-item">
            <div style="height: 20px">
              <label>{{ $t('投注时间') }}</label>
            </div>
            <StartAndEndTimeSelector
              ref="searchTime"
              :startTime.sync="startTime"
              :endTime.sync="endTime"
              :selections="selectionsArr"
              :default-type-p="defaultTypeP"
            />
          </div>

          <div class="search-basic-item">
            <div style="height: 20px">
              <label>{{ $t('开赛时间') }}</label>
            </div>
            <StartAndEndTimeSelector
              ref="searchTime"
              :width="440"
              :left="60"
              :startTime.sync="gameStartTime"
              :endTime.sync="gameEndTime"
              :selections="selectionsArrTwo"
            />
          </div>

          <div class="search-basic-item width180">
            <label>{{ $t('注单号') }}</label>
            <input type="text" v-model="betNo" v-trim @keyup.enter="search()" />
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('会员名') }}</label>
            <input type="text" v-model="memberName" v-trim @keyup.enter="search()" />
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('游戏平台') }}</label>
            <el-select v-model="gamePlatformValue" :placeholder="$t('请选择')" @change="getPlatform" clearable="">
              <el-option v-for="item in gamePlatformOptions" :key="item.value" :label="item.value" :value="item.id">
              </el-option>
            </el-select>
          </div>
          <div class="search-basic-item width180" v-show="mainPageShow">
            <label>{{ $t('注单类型') }}</label>
            <el-select v-model="isTip" :placeholder="$t('请选择')" @change="handleChangTip" clearable="">
              <el-option :label="$t('正常订单')" :value="0"></el-option>
              <el-option :label="$t('小费')" :value="1"></el-option>
            </el-select>
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('状态') }}</label>
            <el-select v-model="statusValue" :placeholder="$t('请选择')">
              <el-option :label="$t('全部')" value=""></el-option>
              <el-option :label="$t('已结算')" :value="1"></el-option>
              <el-option :label="$t('未结算')" :value="0"></el-option>
            </el-select>
          </div>
          <div class="search-basic-item width180" v-show="mainPageShow">
            <label>{{ $t('游戏分类') }}</label>
            <el-select v-model="gameTypeValue" :placeholder="$t('请选择')" :disabled="isLockDisabled">
              <el-option v-for="item in gameTypeOptions" :key="item.key" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('总代') }}</label>
            <el-select
              v-model="topAgyAccountValue"
              :placeholder="$t('请选择')"
              @change="getAgyAccount"
              multiple
              filterable
              clearable
            >
              <el-option
                v-for="item in topAgyAccountOptions"
                :key="item.id"
                :label="item.agyAccount"
                :value="item.id"
              >
                {{ item.agyAccount }}
                <GlobalComponentTestLabel
                  :id="item.id"
                  :parentId="item.parentId"
                />
              </el-option>
            </el-select>
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('代理') }}</label>
            <el-select v-model="agyAccountValue" :placeholder="$t('请选择')" multiple filterable clearable>
              <el-option v-for="item in agyAccountOptions" :key="item.id" :label="item.agyAccount" :value="item.id">
                {{ item.agyAccount }}
                <GlobalComponentTestLabel
                  :id="item.id"
                  :parentId="item.parentId"
                />
              </el-option>
            </el-select>
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('推荐人') }}</label>
            <input type="text" v-model="supLoginName" v-trim @keyup.enter="search()" />
          </div>
          <div class="search-basic-item width180">
            <label>{{ $t('会员组') }}</label>
            <el-select v-model="groupValue" :placeholder="$t('请选择')" clearable>
              <el-option v-for="item in groupOptions" :key="item.id" :label="item.groupName" :value="item.id">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
    </div>
    <el-row
      style="background-color: #f6f7f8; padding: 10px 20px; margin-top: -15px"
      class="border-new-lrb"
    >
      <el-col :span="12" class="tect-le color-blue" style="cursor: pointer">
        <span @click="more"
          >{{ extendTitle }}{{ $t('查询') }}
          <i
            :class="[this.showExtend ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"
            class="icon-more el-select__caret el-input__icon"
          ></i
        ></span>
      </el-col>
      <el-col :span="12" class="tect-ri">
        <el-button
          :loading="isSearching"
          :disabled="isSearching"
          type="primary"
          class="wid-80 center80 gray"
          @click.native="search()"
          >{{ isSearching ? $t('查询中') : $t('查询') }}</el-button
        >
        <el-button class="wid-80" type="danger" @click.native="reset()">{{ $t('重置') }}</el-button>
      </el-col>
    </el-row>
    <div class="export-div" style="height: 55px">
      <div style="position: absolute; top: 30px">
        <span>{{ $t('总投注额') }} : {{ toThousands(allTotal.bet) }}</span>
        <span class="ml20">{{ $t('总有效投注') }} : {{ toThousands(allTotal.validBet) }}</span>
        <span class="ml20">{{ $t('总盈亏') }} : {{ toThousands(allTotal.payout) }}</span>
        <!-- <span class="ml20" v-show="!sportPageShow || !lotteryPageShow">累积投注 : {{allTotal.jackpotBet}}</span>
        <span class="ml20" v-show="!sportPageShow || !lotteryPageShow">累积派彩 : {{allTotal.jackpotPayout}}</span><span>&nbsp;单位(元)</span> -->
      </div>
      <div class="el-button-div">
        <el-button
          class="iconfont icon-export el-button-export"
          v-if="
            hasPermission('analysis:betDetails:exportExcel') && isNowDowning
          "
          :disabled="!total"
          @click="handleExport"
          style="margin-top: 8px"
          >{{ $t('导出') }}</el-button
        >
        <el-button
          class="iconfont icon-export el-button-export"
          style="margin-top: 8px"
          v-if="hasPermission('analysis:betDetails:exportExcel') && !isNowDowning"
          >{{ $t('导出中') }}...</el-button
        >
      </div>
    </div>
    <div class="search-form">
      <el-table :empty-text="$t('暂无查询数据')" :data="tableData.list" v-loading="isLoading" border style="width: 100%">
        <el-table-column :label="$t('序号')" width="45" type="index" :index="indexMethod" align="center"> </el-table-column>
        <el-table-column :label="$t('会员名')" prop="userName" align="center">
          <template slot-scope="scope">
            <div class="lineClamp2">{{ scope.row.userName }}</div>
            <GlobalComponentTestLabel :id="scope.row.tagencyId" />
          </template>
        </el-table-column>
        <el-table-column width="140" :label="$t('注单号')" align="center">
          <template slot-scope="scope">
            <el-button
              style="user-select: text"
              type="text"
              v-if="scope.row.openResultModel"
              @click="openBetDetail(scope.row)"
              >{{ scope.row.id }}
            </el-button>
            <span class="lineClamp2" v-else>{{ scope.row.id }}</span>
            <CopyButton v-if="scope.row.id" :copy-content="scope.row.id" />
          </template>
        </el-table-column>
        <el-table-column
          width="95"
          :label="$t('投注时间')"
          prop="betTime"
          v-if="!tipPageShow"
          :key="Math.random()"
          align="center"
        >
          <template slot-scope="scope">
            <div class="lineClamp2">{{ scope.row.betTime }}</div>
          </template>
        </el-table-column>

        <!-- <el-table-column
          width="95"
          :label="$t('开赛时间')"
          prop="gameStartTime"
          v-if="!tipPageShow"
          :key="Math.random()"
          align="center"
        >
          <template slot-scope="scope">
            <div class="lineClamp2">{{ scope.row.gameStartTime || "-" }}</div>
          </template>
        </el-table-column> -->

        <el-table-column width="140" :label="$t('下注IP')" align="center">
          <template slot-scope="scope">
            <div class="lineClamp2">{{ scope.row.betIp || "-" }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('游戏平台')" prop="platform" align="center">
          <template slot-scope="scope">
            <div class="lineClamp2">{{ scope.row.platform }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('投注金额')" prop="bet" align="right">
          <template slot-scope="scope">
            <div class="lineClamp2">{{ toThousands(scope.row.bet) }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('有效投注')" prop="validBet" align="center">
          <template slot-scope="scope">
            <div class="lineClamp2">{{ toThousands(scope.row.validBet) }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('盈亏')" prop="payout" align="right">
          <template slot-scope="scope">
            <div
              :class="[
                scope.row.payout && scope.row.payout < 0 ? 'payoutRed' : '',
                'lineClamp2',
              ]"
            >
              {{ toThousands(scope.row.payout) }}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column  width="100"  label="下注类型" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div style="text-align:center;" class="betType" v-if="judeg(scope.row)">{{scope.row.betType||'-'}}</div>
            <div style="text-align:center;" v-else-if='scope.row.id'>-</div>  // 总计和小计无下注类型定义
            <div style="text-align:center;" v-else></div>
          </template>
        </el-table-column> -->
        <el-table-column
          v-for="(column, index) in columnArr"
          :key="index"
          :label="column.label"
          :prop="column.prop"
          :width="column.width"
          :align="column.align || 'center'"
        >
          <!-- :formatter="updateTwoNumber" :show-overflow-tooltip="showToolTip(column.prop)" -->
          <el-table-column :label="$t('结算状态')" slot="status" align="center">
            <template slot-scope="scope">
              {{ scope.row.status }}
            </template>
          </el-table-column>

          <!-- <el-table-column label="开奖结果" slot="resultScore" align="center">
            <template slot-scope="scope">
              {{scope.row[['fourth', 'eight'].includes(this.currentTab) ? 'resultScore' : 'result']}}
            </template>
          </el-table-column> -->

          <template slot-scope="scope">
            <!-- 不展示游戏名称后台返回的小计和总计，放在序号列 -->
            <div v-if="showToolTip(column.prop)">
              <div v-if="column.prop === 'gameName' && [$t('小计'), $t('总计')].includes(scope.row.gameName)">-</div>
              <el-tooltip
                v-else-if="
                  column.prop === 'betType' &&
                  judeg(scope.row) &&
                  scope.row.betType
                "
                placement="top-start"
                width="150"
                :content="scope.row.betType"
              >
                <div class="betType lineClamp2">{{ toThousands(scope.row.betType) }}</div>
              </el-tooltip>
              <el-tooltip
                v-else-if="
                  column.prop === 'openResultDetail' &&
                  scope.row.openResultDetail
                "
                placement="top-start"
                width="150"
              >
                <div slot="content">
                  <div
                    v-for="(item, i) in scope.row.openResultDetail.resultMap"
                    :key="i"
                  >
                    <template v-if="scope.row.platformCode === 'ISG'">
                      <p>{{ item.scoTypeName }}</p>
                      <p>{{ item.score }}</p>
                    </template>
                    <template v-else>
                      <p v-if="scope.row.platformCode === 'TC'">
                        {{
                          transTC2(item.playId) || scope.row.playType || "-"
                        }}:{{ item.playOptionName || transTC(item.betText) }}
                      </p>
                      <p v-else>{{ item.playOptionName || item.betText }}</p>
                      <p>{{ item.playName || item.playType || item.id }}</p>
                    </template>
                  </div>
                </div>
                <div
                  class="lineClamp2"
                  v-for="(item, i) in scope.row.openResultDetail.resultMap"
                  :key="i"
                >
                  <template v-if="scope.row.platformCode === 'ISG'">
                    <p>{{ item.scoTypeName }}</p>
                    <p>{{ item.score }}</p>
                  </template>
                  <template v-else>
                    <p v-if="scope.row.platformCode === 'TC'">
                      {{
                        transTC2(item.playId) || scope.row.playType || "-"
                      }}:{{ item.playOptionName || transTC(item.betText) }}
                    </p>
                    <p v-else>{{ item.playOptionName || item.betText }}</p>
                    <p>{{ item.playName || item.playType || item.id }}</p>
                  </template>
                </div>
              </el-tooltip>
              <el-tooltip
                v-else-if="
                  scope.row[column.prop] &&
                  !['betType', 'openResultDetail'].includes(column.prop)
                "
                placement="top-start"
                width="150"
                :content="scope.row[column.prop]"
              >
                <div class="lineClamp2">
                  {{ scope.row[column.prop] }}
                </div>
              </el-tooltip>
              <div v-else>-</div>
            </div>
            <div v-else-if="column.prop === 'resultScore'">
              <!-- <span v-if="scope.row.halfResultScore"
                >{{ $t('全场比分') }}：{{ handleResultScore(scope.row) }},{{ $t('半场比分') }}：{{ scope.row.halfResultScore }}</span -->
              <el-button
                v-if="scope.row.isCombination"
                type="text"
                style="padding: 0 !important"
                @click="showChuan(scope.row)"
                >{{ $t('串关详情查看') }}</el-button
              >
              <span v-else>
                <span v-if="scope.row.halfResultScore">
                  {{ $t('全场比分') }}：{{ handleResultScore(scope.row) }}
                  {{ $t('半场比分') }}：{{scope.row.halfResultScore}}</span>
                <span v-else>{{ handleResultScore(scope.row) }}</span>
              </span>
            </div>
            <div v-else-if="column.prop === 'detail'">
              <div v-if="[$t('小计'), $t('总计')].includes(scope.row.gameName)">-</div>
              <el-button
                v-else-if="scope.row.isCombination || (['小费', '斗鸡'].includes(scope.row.gameType))"
                type="text"
                style="padding: 0 !important"
                @click="showChuan(scope.row)"
                >{{ $t('串关详情查看') }}</el-button
              >
              <div v-else>
                <div
                  v-if="
                    scope.row.gameType === '体育' ||
                    scope.row.gameType === '电竞'
                  "
                >
                  <p>
                    {{ scope.row.oddsType || ""
                    }}{{ scope.row.gameName ? "-" + scope.row.gameName : ""
                    }}{{ scope.row.playType ? "-" + scope.row.playType : ""
                    }}{{
                      scope.row.matchType || scope.row.matchType === 0
                        ? scope.row.matchType == 0
                          ? '-' + $t('滚球')
                          : '-' + $t('非滚球')
                        : ""
                    }}
                  </p>
                  <p>{{ scope.row.leagueName }}</p>
                  <p v-if="scope.row.matchTime">
                    {{ $t('开赛时间') }}：{{ scope.row.matchTime }}
                  </p>
                  <p>{{ scope.row.team }}</p>
                  <div>
                    <el-tooltip
                      v-if="scope.row.openResultDetail"
                      placement="top-start"
                      width="150"
                    >
                      <div slot="content">
                        <div
                          v-for="(item, i) in scope.row.openResultDetail
                            .resultMap"
                          :key="i"
                        >
                          <template v-if="scope.row.platformCode === 'ISG'">
                            <p>{{ item.scoTypeName }}</p>
                            <p>{{ item.score }}</p>
                          </template>
                          <template v-else>
                            <p v-if="scope.row.platformCode === 'TC'">
                              {{
                                transTC2(item.playId) ||
                                scope.row.playType ||
                                "-"
                              }}:{{
                                item.playOptionName || transTC(item.betText)
                              }}
                            </p>
                            <p v-else>
                              {{ item.playOptionName || item.betText }}
                            </p>
                            <p>
                              {{ item.playName || item.playType || item.id }}
                            </p>
                          </template>
                        </div>
                      </div>
                      <div
                        class="lineClamp2"
                        v-for="(item, i) in scope.row.openResultDetail
                          .resultMap"
                        :key="i"
                      >
                        <template v-if="scope.row.platformCode === 'ISG'">
                          <span>{{ item.scoTypeName }}</span>
                          <span>{{ item.score }}</span>
                        </template>
                        <template v-else>
                          <span v-if="scope.row.platformCode === 'TC'"
                            >{{
                              transTC2(item.playId) ||
                              scope.row.playType ||
                              "-"
                            }}:{{
                              item.playOptionName || transTC(item.betText)
                            }}</span
                          >
                          <span v-else>{{
                            item.playOptionName || item.betText
                          }}</span>
                          <span>{{
                            item.playName || item.playType || item.id
                          }}</span>
                        </template>
                      </div>
                    </el-tooltip>
                  </div>
                  <p>
                  <span v-if="scope.row.betScore">{{ $t('下注时比分') }}：{{ scope.row.betScore }}</span> {{ $t('赔率') }}：{{
                    scope.row.odds || '-'
                  }}
                </p>
                </div>
                <div v-else-if="['真人'].includes(scope.row.gameType)">
                  <p>{{ scope.row.gameName || "-" }}</p>
                  <div>
                    <el-tooltip
                      v-if="scope.row.openResultDetail"
                      placement="top-start"
                      width="150"
                    >
                      <div slot="content">
                        <div
                          v-for="(item, i) in scope.row.openResultDetail
                            .resultMap"
                          :key="i"
                        >
                          <template v-if="scope.row.platformCode === 'ISG'">
                            <p>{{ item.scoTypeName }}</p>
                            <p>{{ item.score }}</p>
                          </template>
                          <template v-else>
                            <p v-if="scope.row.platformCode === 'TC'">
                              {{
                                transTC2(item.playId) ||
                                scope.row.playType ||
                                "-"
                              }}:{{
                                item.playOptionName || transTC(item.betText)
                              }}
                            </p>
                            <p v-else>
                              {{ item.playOptionName || item.betText }}
                            </p>
                            <p>
                              {{ item.playName || item.playType || item.id }}
                            </p>
                          </template>
                        </div>
                      </div>
                      <div
                        class="lineClamp2"
                        v-for="(item, i) in scope.row.openResultDetail
                          .resultMap"
                        :key="i"
                      >
                        <template v-if="scope.row.platformCode === 'ISG'">
                          <span>{{ item.scoTypeName }}</span>
                          <span>{{ item.score }}</span>
                        </template>
                        <template v-else>
                          <span v-if="scope.row.platformCode === 'TC'"
                            >{{
                              transTC2(item.playId) ||
                              scope.row.playType ||
                              "-"
                            }}:{{
                              item.playOptionName || transTC(item.betText)
                            }}</span
                          >
                          <span v-else>{{
                            item.playOptionName || item.betText
                          }}</span>
                          <span>{{
                            item.playName || item.playType || item.id
                          }}</span>
                        </template>
                      </div>
                    </el-tooltip>
                  </div>
                  <p v-if="scope.row.odds">{{ $t('赔率') }}：{{ scope.row.odds }}</p>
                </div>
                <div v-else-if="/[电子|捕鱼|棋牌]/.test(scope.row.gameType)">
                  <p>{{ scope.row.gameName || "-" }}</p>
                </div>
                <div v-else-if="['彩票', '滚球'].includes(scope.row.gameType)">
                  <p>
                    {{ scope.row.gameName ? scope.row.gameName + "-" : ""
                    }}{{ scope.row.playType || "" }}
                  </p>
                  <div>
                    <el-tooltip
                      v-if="scope.row.openResultDetail"
                      placement="top-start"
                      width="150"
                    >
                      <div slot="content">
                        <div
                          v-for="(item, i) in scope.row.openResultDetail
                            .resultMap"
                          :key="i"
                        >
                          <template v-if="scope.row.platformCode === 'ISG'">
                            <p>{{ item.scoTypeName }}</p>
                            <p>{{ item.score }}</p>
                          </template>
                          <template v-else>
                            <p v-if="scope.row.platformCode === 'TC'">
                              {{
                                transTC2(item.playId) ||
                                scope.row.playType ||
                                "-"
                              }}:{{
                                item.playOptionName ||  isTranslate(scope.row, item.betText)
                              }} 
                            </p>
                            <p v-else>
                              {{ item.playOptionName || item.betText }}
                            </p>
                            <p>
                              {{ item.playName || item.playType || item.id }}
                            </p>
                          </template>
                        </div>
                      </div>
                      <div
                        class="lineClamp2"
                        v-for="(item, i) in scope.row.openResultDetail
                          .resultMap"
                        :key="i"
                      >
                        <template v-if="scope.row.platformCode === 'ISG'">
                          <span>{{ item.scoTypeName }}</span>
                          <span>{{ item.score }}</span>
                        </template>
                        <template v-else>
                          <span v-if="scope.row.platformCode === 'TC'"
                            >{{
                              transTC2(item.playId) ||
                              scope.row.playType ||
                              "-"
                            }}:{{
                              item.playOptionName || isTranslate(scope.row, item.betText)
                            }}</span>
                          <span v-else>{{
                            item.playOptionName || item.betText
                          }}</span>
                          <span>{{
                            item.playName || item.playType || item.id
                          }}</span>
                        </template>
                      </div>
                    </el-tooltip>
                  </div>
                  <p>{{ $t('赔率') }}：{{ scope.row.odds ? scope.row.odds : "-" }}</p>
                </div>
              </div>
            </div>
            <div v-else class="lineClamp2">
              {{ scope.row[column.prop] ? scope.row[column.prop] : "-" }}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bet-record-pagination">
      <span>{{ $t('共') }}{{ totalCount }}{{ $t('条') }}</span>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listReq.pageNo"
        :page-sizes="listReq.pageSizeArr"
        :page-size="listReq.pageSize"
        layout="sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </div>
    <div class="intTime">
      <div>{{ $t('网络加载时间') }}：{{ networkLoadTime }}</div>
      <div>{{ $t('数据处理时间') }}：{{ dataSolveTime }}</div>
    </div>
    <!--baijia-->
    <el-dialog @close="betDetailShow = false" :title="$t('注单详情')" :visible.sync="betDetailShow">
      <div class="bet-detail" v-if="betDetailShow">
        <div class="row1">
          <div class="left">{{ $t('局号') }}</div>
          <div class="right">{{ rowData.serialId }}(&nbsp;&nbsp;{{ $t('注单号') }}:&nbsp;&nbsp;{{ rowData.id }}&nbsp;&nbsp;)</div>
        </div>
        <div class="row1">
          <div class="left">{{ $t('桌号') }}</div>
          <div class="right">{{ rowData.tableNo || '-' }}</div>
        </div>
        <!--eg百家乐-->
        <div class="result-bjl" v-show="rowData.openResultModel && rowData.openResultModel.type === 'eg1'">
          <div class="left1">{{ $t('结果') }}</div>
          <div class="right1">
            <div class="item">
              <div class="left">
                <span class="xian resultMarker"
                  >{{ $t('闲') }}{{
                    rowData.openResultModel && rowData.openResultModel.resultMap[0]
                      ? rowData.openResultModel.resultMap[0].xResult
                      : ''
                  }}{{ $t('点') }}({{ parseResultXeg() }})</span
                >
              </div>
              <div class="right">
                <span class="zhuang resultMarker"
                  >{{ $t('庄') }}{{
                    rowData.openResultModel && rowData.openResultModel.resultMap[0]
                      ? rowData.openResultModel.resultMap[0].zResult
                      : ''
                  }}{{ $t('点') }}({{ parseResultZeg() }})</span
                >
              </div>
            </div>
          </div>
        </div>
        <!--bbin ag百家乐-->
        <div
          class="result-bjl"
          v-show="
            rowData.openResultModel &&
            (rowData.openResultModel.type === 'bbin3001' ||
              rowData.openResultModel.type === 'bbin3017' ||
              rowData.openResultModel.type === 'aginbac' ||
              rowData.openResultModel.type === 'agincbac' ||
              rowData.openResultModel.type === 'aginlink' ||
              rowData.openResultModel.type === 'aginlbac' ||
              rowData.openResultModel.type === 'aginsbac')
          "
        >
          <div class="left1">{{ $t('结果') }}</div>
          <div class="right1">
            <div class="item">
              <div class="left">
                <span class="xian resultMarker"
                  >{{ $t('闲') }}{{
                    rowData.openResultModel && rowData.openResultModel.resultMap[0]
                      ? rowData.openResultModel.resultMap[0].xResult
                      : ''
                  }}{{ $t('点') }}({{ parseResultXag() }})</span
                >
              </div>
              <div class="right">
                <span class="zhuang resultMarker"
                  >{{ $t('庄') }}{{
                    rowData.openResultModel && rowData.openResultModel.resultMap[0]
                      ? rowData.openResultModel.resultMap[0].zResult
                      : ''
                  }}{{ $t('点') }}({{ parseResultZag() }})</span
                >
              </div>
            </div>
          </div>
        </div>
        <!--龙虎斗-->
        <div
          class="result-bjl"
          v-show="
            rowData.openResultModel &&
            (rowData.openResultModel.type === 'agindt' ||
              rowData.openResultModel.type === 'bbin3003')
          "
        >
          <div class="left1">{{ $t('结果') }}</div>
          <div class="right1">
            <div class="item">
              <div class="left">
                <span class="long"
                  >{{ $t('龙') }}{{
                    rowData.openResultModel && rowData.openResultModel.resultMap[0]
                      ? rowData.openResultModel.resultMap[0].dragonpointResult
                      : ""
                  }}({{ parseResultLong() }})</span
                >
              </div>
              <div class="right">
                <span class="hu"
                  >{{ $t('虎') }}{{
                    rowData.openResultModel && rowData.openResultModel.resultMap[0]
                      ? rowData.openResultModel.resultMap[0].tigerpointResult
                      : ""
                  }}({{ parseResultHu() }})</span
                >
              </div>
            </div>
          </div>
        </div>
        <!--ag bbin骰宝-->
        <div
          class="result-paijiu result-saibao"
          v-show="
            rowData.openResultModel &&
            (rowData.openResultModel.type === 'bbin3008' ||
              rowData.openResultModel.type === 'aginshb')
          "
        >
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="right1">
              <div class="item">{{ $t('总点数') }}({{ parseSaibao('all') }})</div>
            </div>
            <div class="right1">
              <div class="item">{{ parseSaibao() }}</div>
            </div>
          </div>
        </div>
        <!--bbin无限21点-->
        <div class="result-bb21" v-show="rowData.openResultModel && rowData.openResultModel.type === 'bbin3014'">
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="right1">
              <div class="item resultMarker">{{ $t('庄') }}({{ rowData.openResultModel.resultMap[0].zResult }})</div>
              <div class="item resultMarker">{{ $t('闲') }}({{ rowData.openResultModel.resultMap[0].xResult }})</div>
            </div>
          </div>
        </div>
        <!--ag无限21点-->
        <div class="result-ag21" v-show="rowData.openResultModel && rowData.openResultModel.type === 'aginbj'">
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="right1">
              <div class="item resultMarker">
                {{ $t('庄') }}({{
                  rowData.openResultModel && rowData.openResultModel.resultMap[0]
                    ? rowData.openResultModel.resultMap[0].BResult
                    : ""
                }})
              </div>
              <div class="item resultMarker">
                {{ $t('闲1') }}({{
                  rowData.openResultModel && rowData.openResultModel.resultMap[0]
                    ? rowData.openResultModel.resultMap[0].P1Result
                    : ""
                }})
              </div>
              <div class="item resultMarker">
                {{ $t('闲2') }}({{
                  rowData.openResultModel && rowData.openResultModel.resultMap[0]
                    ? rowData.openResultModel.resultMap[0].P2Result
                    : ""
                }})
              </div>
              <div class="item resultMarker">
                {{ $t('闲3') }}({{
                  rowData.openResultModel && rowData.openResultModel.resultMap[0]
                    ? rowData.openResultModel.resultMap[0].P3Result
                    : ""
                }})
              </div>
            </div>
            <div class="right1">
              <div class="item">{{ parseZ21() }}</div>
              <div class="item">{{ parseX211() }}</div>
              <div class="item">{{ parseX212() }}</div>
              <div class="item">{{ parseX213() }}</div>
            </div>
            <div class="right1">
              <div class="item resultMarker">
                {{ $t('闲4') }}({{
                  rowData.openResultModel && rowData.openResultModel.resultMap[0]
                    ? rowData.openResultModel.resultMap[0].P4Result
                    : ""
                }})
              </div>
              <div class="item resultMarker">
                {{ $t('闲5') }}({{
                  rowData.openResultModel && rowData.openResultModel.resultMap[0]
                    ? rowData.openResultModel.resultMap[0].P5Result
                    : ""
                }})
              </div>
              <div class="item resultMarker">
                {{ $t('闲6') }}({{
                  rowData.openResultModel && rowData.openResultModel.resultMap[0]
                    ? rowData.openResultModel.resultMap[0].P6Result
                    : ""
                }})
              </div>
              <div class="item resultMarker">
                {{ $t('闲7') }}({{
                  rowData.openResultModel && rowData.openResultModel.resultMap[0]
                    ? rowData.openResultModel.resultMap[0].P7Result
                    : ""
                }})
              </div>
            </div>
            <div class="right1">
              <div class="item">{{ parseX214() }}</div>
              <div class="item">{{ parseX215() }}</div>
              <div class="item">{{ parseX216() }}</div>
              <div class="item">{{ parseX217() }}</div>
            </div>
          </div>
        </div>
        <!--色碟-->
        <div class="result-rou" v-show="rowData.openResultModel && rowData.openResultModel.type === 'bbin3011'">
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="right1">
              <div class="item">{{ parseSedie() }}</div>
            </div>
          </div>
        </div>
        <!--ag bbin 申博轮盘-->
        <div
          class="result-rou"
          v-show="
            rowData.openResultModel &&
            /^aginrou|bbin3007|roulette|color_dish$/.test(
              rowData.openResultModel.type
            )
          "
        >
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="item">
              {{
                rowData.openResultModel && rowData.openResultModel.resultMap[0]
                  ? rowData.openResultModel.resultMap[0].rouResult ||
                    rowData.openResultModel.resultMap[0].openResult
                  : "-"
              }}
            </div>
          </div>
        </div>
        <!--番摊-->
        <div
          class="result-rou"
          v-show="
            rowData.openResultModel &&
            /^bbin3015|fan_booth$/.test(rowData.openResultModel.type)
          "
        >
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="item">
              {{
                rowData.openResultModel && rowData.openResultModel.resultMap[0]
                  ? rowData.openResultModel.resultMap[0].buttonCounts ||
                    rowData.openResultModel.resultMap[0].result
                  : ""
              }}
            </div>
          </div>
        </div>
        <!--鱼虾蟹-->
        <div class="result-rou" v-show="rowData.openResultModel && rowData.openResultModel.type === 'bbin3016'">
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="item">{{ parseFish() }}</div>
          </div>
        </div>
        <!--bbin炸金花-->
        <div
          class="result-sangong result-saibao"
          v-show="
            rowData.openResultModel &&
            rowData.openResultModel.type === 'bbin3018'
          "
        >
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="right2">
              <div class="item">{{ $t('龙') }}({{ parseDragon() }})</div>
              <div class="item">{{ $t('凤') }}({{ parseFeng() }})</div>
            </div>
            <div class="right2">
              <div class="item">{{ parseResultDragon() }}</div>
              <div class="item">{{ parseResultFeng() }}</div>
            </div>
          </div>
        </div>
        <!--ag炸金花-->
        <div
          class="result-sangong result-saibao"
          v-show="
            rowData.openResultModel &&
            rowData.openResultModel.type === 'aginzjh'
          "
        >
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="right2">
              <div class="item">{{ $t('龙') }}({{ parseDragon2() }})</div>
              <div class="item">{{ $t('凤') }}({{ parseFeng2() }})</div>
            </div>
            <div class="right2">
              <div class="item">{{ parseResultDragon() }}</div>
              <div class="item">{{ parseResultFeng() }}</div>
            </div>
          </div>
        </div>
        <!--ag牛牛-->
        <div
          class="result-sangong"
          v-show="
            rowData.openResultModel &&
            (rowData.openResultModel.type === 'aginnn' ||
              rowData.openResultModel.type === 'bbin3012')
          "
        >
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="right1">
              <div class="item resultMarker">{{ $t('庄') }}({{ parseResultZnn() }})</div>
              <div class="item resultMarker">{{ $t('闲1') }}({{ parseResultX1nn() }})</div>
            </div>
            <div class="right1">
              <div class="item resultMarker">{{ parseResultZResult() }}</div>
              <div class="item resultMarker">{{ parseResultXResult1() }}</div>
            </div>
            <div class="right1">
              <div class="item resultMarker">{{ $t('闲2') }}({{ parseResultX2nn() }})</div>
              <div class="item resultMarker">{{ $t('闲3') }}({{ parseResultX3nn() }})</div>
            </div>
            <div class="right1">
              <div class="item resultMarker">{{ parseResultXResult2() }}</div>
              <div class="item resultMarker">{{ parseResultXResult3() }}</div>
            </div>
          </div>
        </div>
        <!--bbin温州牌九-->
        <div class="result-paijiu" v-show="rowData.openResultModel && rowData.openResultModel.type === 'bbin3006'">
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="right1">
              <div class="item">{{ $t('庄') }}</div>
              <div class="item">{{ $t('顺门') }}</div>
              <div class="item">{{ $t('出门') }}</div>
              <div class="item">{{ $t('到门') }}</div>
            </div>
            <div class="right1">
              <div class="item">{{ parseBBZPaijiu() }}</div>
              <div class="item">{{ parseBBShunPaijiu() }}</div>
              <div class="item">{{ parseBBChuPaijiu() }}</div>
              <div class="item">{{ parseBBDaoPaijiu() }}</div>
            </div>
            <div class="right1">
              <div class="item">{{ parseBBRPaijiu() }}</div>
            </div>
          </div>
        </div>
        <!--德州扑克-->
        <div class="result-dezhou" v-show="rowData.openResultModel && rowData.openResultModel.type === 'bbin3010'">
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="right1">
              <div class="item">{{ $t('庄') }}</div>
              <div class="item">{{ $t('公家牌') }}</div>
              <div class="item resultMarker">{{ $t('闲') }}({{ rowData.result }})</div>
            </div>
            <div class="right1">
              <div class="item resultMarker">{{ parseDezhouPoke1() }}</div>
              <div class="item resultMarker">{{ parseDezhouPoke2() }}</div>
              <div class="item resultMarker">{{ parseDezhouPoke3() }}</div>
            </div>
          </div>
        </div>
        <!--AG BBIN 申博百家乐 斗牛 BBIN德州扑克-->
        <div
          class="result-sangong result-bjl-sb"
          v-if="
            rowData.openResultModel &&
            /^baccarat|bull_fight|card_poker_3|deZhou_poker|aginbf$/.test(
              rowData.openResultModel.type
            )
          "
        >
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div
              class="wrapper"
              v-if="rowData.openResultModel.resultMap[0].zOpenResult"
            >
              <div class="right3">
                <div class="label resultMarker">
                  {{ $t('庄') }}<template v-if="rowData.openResultModel.resultMap[0].zResult"
                    >({{ rowData.openResultModel.resultMap[0].zResult }})</template
                  >
                </div>
                <div class="value resultMarker">
                  {{
                    JSON.parse(
                      rowData.openResultModel.resultMap[0].zOpenResult
                    ).join("")
                  }}
                </div>
              </div>
              <div class="right3" v-if="rowData.openResultModel.resultMap[0].gOpenResult">
                <div class="label resultMarker">{{ $t('公家牌') }}</div>
                <div class="value resultMarker">
                  {{
                    JSON.parse(
                      rowData.openResultModel.resultMap[0].gOpenResult
                    ).join("")
                  }}
                </div>
              </div>
              <div class="right3">
                <div class="label resultMarker">
                  {{ $t('闲') }}<template v-if="rowData.openResultModel.resultMap[0].xResult"
                    >({{ rowData.openResultModel.resultMap[0].xResult }})</template
                  >
                </div>
                <div class="value resultMarker">
                  {{
                    JSON.parse(
                      rowData.openResultModel.resultMap[0].xOpenResult
                    ).join("")
                  }}
                </div>
              </div>
            </div>
            <div
              class="wrapper"
              v-if="rowData.openResultModel.resultMap[0].rOpenResult"
            >
              <div class="right3">
                <div class="label resultMarker">
                  {{ $t('红牛') }}<template v-if="rowData.openResultModel.resultMap[0].rResult"
                    >({{ rowData.openResultModel.resultMap[0].rResult }})</template
                  >
                </div>
                <div class="value resultMarker">
                  {{
                    JSON.parse(
                      rowData.openResultModel.resultMap[0].rOpenResult
                    ).join("")
                  }}
                </div>
              </div>
              <div class="right3">
                <div class="label resultMarker">
                  {{ $t('黑牛') }}<template v-if="rowData.openResultModel.resultMap[0].bResult"
                    >({{ rowData.openResultModel.resultMap[0].bResult }})</template
                  >
                </div>
                <div class="value resultMarker">
                  {{
                    JSON.parse(
                      rowData.openResultModel.resultMap[0].bOpenResult
                    ).join("")
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--AG 申博骰宝-->
        <div
          class="result-paijiu result-saibao result-saibai-sb"
          v-if="
            rowData.openResultModel &&
            /^sic_bo|fish_shrimp_crab$/.test(rowData.openResultModel.type)
          "
        >
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="right1" v-if="rowData.openResultModel.resultMap[0].result">
              <div class="item">{{ $t('总点数') }}({{ rowData.openResultModel.resultMap[0].result }})</div>
            </div>
            <div class="right1 touzi">
              <div class="item resultMarker">
                {{
                  JSON.parse(
                    rowData.openResultModel.resultMap[0].openResult
                  ).join("")
                }}
              </div>
            </div>
          </div>
        </div>
        <!--AG BBIN 申博龙虎斗-->
        <div
          class="result-sangong result-bjl-sb result-dragon"
          v-if="
            rowData.openResultModel &&
            rowData.openResultModel.type === 'dragon_tiger'
          "
        >
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="right2">
              <div class="item">{{ $t('龙') }}</div>
              <div class="item">{{ $t('虎') }}</div>
            </div>
            <div class="right2" style="flex: 1">
              <div class="item resultMarker">
                {{ rowData.openResultModel.resultMap[0].dragonOpenResult }}
              </div>
              <div class="item resultMarker">
                {{ rowData.openResultModel.resultMap[0].tigerOpenResult }}
              </div>
            </div>
          </div>
        </div>
        <!--申博麻将-->
        <div
          class="result-sangong result-mj-sb"
          v-if="
            rowData.openResultModel &&
            /^mahJong$/.test(rowData.openResultModel.type)
          "
        >
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="item">
              <div class="label">{{ $t('庄') }}</div>
              <div class="value resultMarker">{{ rowData.openResultModel.resultMap[0].zOpenResult }}</div>
            </div>
            <div
              class="item"
              v-for="(item, index) in JSON.parse(
                rowData.openResultModel.resultMap[0].xOpenResult
              )"
              :key="index"
            >
              <div class="label">{{ $t('闲') }}{{ index + 1 }}</div>
              <div class="value resultMarker">{{ item }}</div>
            </div>
          </div>
        </div>
        <!--BBIN三公 牛牛-->
        <div
          class="result-sangong result-mj-sb result-sangong-sb"
          v-if="
            rowData.openResultModel &&
            /^bbin3005|bull_bull$/.test(rowData.openResultModel.type)
          "
        >
          <div class="left" :class="{ isBull: rowData.openResultModel.type === 'bull_bull' }">{{ $t('结果') }}</div>
          <div class="right">
            <div class="item">
              <div class="label">{{ $t('庄') }}</div>
              <div class="value resultMarker">
                {{
                  JSON.parse(
                    rowData.openResultModel.resultMap[0].zOpenResult
                  ).join("")
                }}
              </div>
            </div>
            <div
              class="item"
              v-for="i in JSON.parse(
                rowData.openResultModel.resultMap[0].xOpenResult
              ).length /
              { bbin3005: 3, bull_bull: 5 }[rowData.openResultModel.type]"
              :key="i"
            >
              <div class="label">
                {{ $t('闲') }}{{ i
                }}<template v-if="rowData.openResultModel.resultMap[0].xResult"
                  >({{
                    JSON.parse(rowData.openResultModel.resultMap[0].xResult)[
                      i - 1
                    ]
                  }})</template
                >
              </div>
              <div class="value resultMarker">
                {{
                  JSON.parse(rowData.openResultModel.resultMap[0].xOpenResult)
                    .slice(
                      { bbin3005: 3, bull_bull: 5 }[
                        rowData.openResultModel.type
                      ] *
                        (i - 1),
                      { bbin3005: 3, bull_bull: 5 }[
                        rowData.openResultModel.type
                      ] * i
                    )
                    .join("")
                }}
              </div>
            </div>
          </div>
        </div>
        <!-- BBIN 温州牌九 -->
        <div class="wenZhou_paiGow" v-if="rowData.openResultModel && rowData.openResultModel.type === 'wenZhou_paiGow'">
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="right2">
              <div class="label">{{ $t('庄') }}</div>
              <div class="value resultMarker">
                {{
                  JSON.parse(
                    rowData.openResultModel.resultMap[0].zOpenResult
                  ).join("")
                }}
              </div>
            </div>
            <div class="right2">
              <div class="label">{{ $t('顺门') }}</div>
              <div class="value resultMarker">
                {{
                  JSON.parse(
                    rowData.openResultModel.resultMap[0].sOpenResult
                  ).join("")
                }}
              </div>
            </div>
            <div class="right2">
              <div class="label">{{ $t('出门') }}</div>
              <div class="value resultMarker">
                {{
                  JSON.parse(
                    rowData.openResultModel.resultMap[0].cOpenResult
                  ).join("")
                }}
              </div>
            </div>
            <div class="right2">
              <div class="label">{{ $t('到门') }}</div>
              <div class="value resultMarker">
                {{
                  JSON.parse(
                    rowData.openResultModel.resultMap[0].dOpenResult
                  ).join("")
                }}
              </div>
            </div>
            <div class="result">
              {{ rowData.openResultModel.resultMap[0].result }}
            </div>
          </div>
        </div>
        <!-- 新AG 无限21点 -->
        <div class="result-ag21" v-if="rowData.openResultModel && rowData.openResultModel.type === 'point_21'">
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="right2">
              <div class="label">{{ $t('庄') }}({{ rowData.openResultModel.resultMap[0].zResult }})</div>
              <div class="value resultMarker">
                {{
                  JSON.parse(
                    rowData.openResultModel.resultMap[0].zOpenResult
                  ).join("")
                }}
              </div>
            </div>
            <div
              class="right2"
              v-for="(item, index) in JSON.parse(
                rowData.openResultModel.resultMap[0].xOpenResult
              )"
              :key="index"
            >
              <div class="label">
                {{ $t('闲') }}{{ index + 1 }}({{ JSON.parse(rowData.openResultModel.resultMap[0].xResult)[index] }})
              </div>
              <div class="value resultMarker">{{ item.join("") }}</div>
            </div>
          </div>
        </div>
        <!-- 新AG 炸金花-->
        <div
          class="result-sangong result-bjl-sb result-dragon"
          v-if="
            rowData.openResultModel &&
            /^fried_golden_flower$/.test(rowData.openResultModel.type)
          "
        >
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="right2">
              <div class="item resultMarker">
                {{ $t('龙') }}<template v-if="rowData.openResultModel.resultMap[0].dResult"
                  >({{ rowData.openResultModel.resultMap[0].dResult }})</template
                >
              </div>
              <div class="item resultMarker">
                {{ $t('凤') }}<template v-if="rowData.openResultModel.resultMap[0].pResult"
                  >({{ rowData.openResultModel.resultMap[0].pResult }})</template
                >
              </div>
            </div>
            <div class="right2" style="flex: 1">
              <div class="item resultMarker">
                {{
                  JSON.parse(
                    rowData.openResultModel.resultMap[0].dOpenResult
                  ).join("")
                }}
              </div>
              <div class="item resultMarker">
                {{
                  JSON.parse(
                    rowData.openResultModel.resultMap[0].pOpenResult
                  ).join("")
                }}
              </div>
            </div>
          </div>
        </div>
        <!-- 新AS 红黑解析模板 -->
        <div class="result-ag21" v-if="rowData.openResultModel && rowData.openResultModel.type === 'asvbr'">
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="right2">
              <div class="label">{{ $t('红') }}({{ rowData.openResultModel.resultMap[0].zResult }})</div>
              <div class="value resultMarker">
                {{
                  JSON.parse(
                    rowData.openResultModel.resultMap[0].zOpenResult
                  ).join("")
                }}
              </div>
            </div>
            <div class="right2">
              <div class="label">{{ $t('黑') }}({{ rowData.openResultModel.resultMap[0].xResult }})</div>
              <div class="value resultMarker">
                {{
                  JSON.parse(
                    rowData.openResultModel.resultMap[0].xOpenResult
                  ).join("")
                }}
              </div>
            </div>
          </div>
        </div>
        <!-- 新AS 真人二八杠 -->
        <div class="result-ag21" v-if="rowData.openResultModel && rowData.openResultModel.type === 'asteb'">
          <div class="left">{{ $t('结果') }}</div>
          <div class="right">
            <div class="right2">
              <div class="label">{{ $t('庄') }}</div>
              <div class="value resultMarker">
                {{
                  JSON.parse(
                    rowData.openResultModel.resultMap[0].sOpenResult
                  ).join("")
                }}
              </div>
            </div>
            <div class="right2">
              <div class="label">{{ $t('顺') }}</div>
              <div class="value resultMarker">
                {{
                  JSON.parse(
                    rowData.openResultModel.resultMap[0].cOpenResult
                  ).join("")
                }}
              </div>
            </div>
            <div class="right2">
              <div class="label">{{ $t('天') }}</div>
              <div class="value resultMarker">
                {{
                  JSON.parse(
                    rowData.openResultModel.resultMap[0].dOpenResult
                  ).join("")
                }}
              </div>
            </div>
            <div class="right2">
              <div class="label">{{ $t('地') }}</div>
              <div class="value resultMarker">
                {{
                  JSON.parse(
                    rowData.openResultModel.resultMap[0].zOpenResult
                  ).join("")
                }}
              </div>
            </div>
          </div>
        </div>
        <div class="row2">
          <div class="left">
            <div class="item1">{{ $t('下注类型') }}</div>
            <div class="item1">{{ $t('赔率') }}</div>
          </div>
          <div class="item">{{ $t('下注金额') }}</div>
          <div class="item">{{ $t('总盈亏') }}</div>
        </div>
        <!-- 结果展示 -->
        <template
          v-if="
            rowData.openResultModel &&
            /^baccarat|roulette|sic_bo|dragon_tiger|bull_fight|mahJong|card_poker_3|point_21|fried_golden_flower|bbin3005|wenZhou_paiGow|deZhou_poker|color_dish|bull_bull|fan_booth|fish_shrimp_crab|aginbf|bbin3014|asvbr|asteb$/.test(
              rowData.openResultModel.type
            )
          "
        >
          <div
            class="row2"
            v-for="(item, index) in JSON.parse(
              rowData.openResultModel.resultMap[0].bets
            )"
            :key="index"
          >
            <div class="left">
              <div class="item1 betResult-betType">{{ item.betType }}</div>
              <div class="item1">{{ item.odds }}</div>
            </div>
            <div class="item">{{ item.bet }}</div>
            <div class="item">{{ item.payout }}</div>
          </div>
        </template>
        <template v-if="rowData.platformCode === 'SABG'">
          <div
            class="row2"
            v-for="(item, index) in JSON.parse(rowData.betType)"
            :key="index"
          >
            <div class="left">
              <div class="item1 betResult-betType">{{ item.betType }}</div>
              <div class="item1">{{ item.odds }}</div>
            </div>
            <div class="item">{{ item.bet }}</div>
            <div class="item">{{ item.payout }}</div>
          </div>
        </template>
        <template v-else>
          <div
            class="row2"
            v-show="
              rowData.openResultModel && rowData.openResultModel.type !== 'eg1'
            "
            v-for="(betItem, index) in betTypeArr"
            :key="index"
          >
            <div class="left">
              <div class="item1" v-if="rowData.platformCode === 'TC'">
                {{ transTC(betTypeFilter(betItem, 0)) }}
              </div>
              <div class="item1" v-else>{{ betTypeFilter(betItem, 0) }}</div>
              <div class="item1">{{ betTypeFilter(betItem, 1) }}</div>
            </div>
            <div class="item">{{ betTypeFilter(betItem, 2) }}</div>
            <div class="item">{{ betTypeFilter(betItem, 3) }}</div>
          </div>
          <!---eg row2 the weight of v-for is higher than v-if -->
          <div
            class="row2"
            v-show="
              rowData.openResultModel && rowData.openResultModel.type === 'eg1'
            "
            v-for="(item, index) in betsArr"
            :key="index"
          >
            <div class="left">
              <div class="item1">{{ item.betType }}</div>
              <div class="item1">-</div>
            </div>
            <div class="item">{{ item.bet }}</div>
            <div class="item" v-if="betsArr.length === 1">
              {{ rowData.payout }}
            </div>
            <div class="item" v-else>-</div>
          </div>
        </template>
        <div class="row3">
          <div class="left">{{ $t('总计') }}</div>
          <div class="item">{{ rowData.bet }}</div>
          <div class="item">{{ rowData.payout }}</div>
        </div>
      </div>
    </el-dialog>
    <el-dialog @close="betDetailSportShow = false" :title="$t('注单详情')" :visible.sync="betDetailSportShow">
      <div class="bet-detail" v-show="sportBet1Show">
        <div class="row4">
          <div class="left">{{ $t('类型') }}</div>
          <div class="right">
            {{ rowData.gameName
            }}{{
              rowData.openResultModel && rowData.openResultModel.resultMap[0]
                ? "-" + rowData.openResultModel.resultMap[0].oddsType
                : ""
            }}{{
              rowData.openResultModel && rowData.openResultModel.resultMap[0]
                ? '-' + rowData.openResultModel.resultMap[0].leagueName
                : ''
            }}({{ $t('注单号') }}:{{ rowData.id }})
          </div>
        </div>
        <div class="row4">
          <div class="left"><span>{{ $t('详情') }}</span></div>
          <div class="right">
            <p>
              {{
                rowData.openResultModel &&
                rowData.openResultModel.resultMap[0] &&
                rowData.openResultModel.resultMap[0].homeIdName
                  ? rowData.openResultModel.resultMap[0].homeIdName
                  : ""
              }}
              {{
                rowData.openResultModel &&
                rowData.openResultModel.resultMap[0] &&
                rowData.openResultModel.resultMap[0].awayIdName
                  ? " VS " + rowData.openResultModel.resultMap[0].awayIdName
                  : ""
              }}&nbsp;&nbsp; {{ rowData ? rowData.betType : ""
              }}{{
                rowData.openResultModel && rowData.openResultModel.resultMap[0]
                  ? "(" + rowData.openResultModel.resultMap[0].betTeam
                  : ""
              }}
              {{
                rowData.openResultModel && rowData.openResultModel.resultMap[0]
                  ? rowData.openResultModel.resultMap[0].hdp + ')'
                  : ''
              }}&nbsp;&nbsp;{{ $t('赔率') }} :
              {{
                rowData.openResultModel && rowData.openResultModel.resultMap[0]
                  ? rowData.openResultModel.resultMap[0].odds
                  : ""
              }}
            </p>
            <p>
              {{
                rowData.openResultModel &&
                rowData.openResultModel.resultMap[0] &&
                rowData.openResultModel.resultMap[0].betDatetime
                  ? $t('下注时间') + ':  ' + rowData.openResultModel.resultMap[0].betDatetime
                  : ''
              }}
            </p>
            <p>
              {{
                rowData.openResultModel &&
                rowData.openResultModel.resultMap[0] &&
                rowData.openResultModel.resultMap[0].matchDateTime
                  ? $t('开赛时间') + ':  ' + rowData.openResultModel.resultMap[0].matchDateTime
                  : ''
              }}
            </p>
            <p>
              {{
                rowData.openResultModel &&
                rowData.openResultModel.resultMap[0] &&
                rowData.openResultModel.resultMap[0].homeScoreRealTime
                  ? $t('下注比分') + ': ' + rowData.openResultModel.resultMap[0].homeScoreRealTime
                  : ''
              }}
              {{
                rowData.openResultModel &&
                rowData.openResultModel.resultMap[0] &&
                rowData.openResultModel.resultMap[0].awayScoreRealTime
                  ? " : " +
                    rowData.openResultModel.resultMap[0].awayScoreRealTime
                  : ""
              }}&nbsp;&nbsp;
              {{
                rowData.openResultModel &&
                rowData.openResultModel.resultMap[0] &&
                rowData.openResultModel.resultMap[0].homeScoreResult
                  ? $t('完场比分') + ': ' + rowData.openResultModel.resultMap[0].homeScoreResult
                  : ''
              }}
              {{
                rowData.openResultModel &&
                rowData.openResultModel.resultMap[0] &&
                rowData.openResultModel.resultMap[0].awayScoreResult
                  ? " : " + rowData.openResultModel.resultMap[0].awayScoreResult
                  : ""
              }}&nbsp;&nbsp;
              <span :class="[rowData && rowData.result && rowData.result === $t('赢') ? 'green' : 'red']">
                {{
                  rowData.openResultModel &&
                  rowData.openResultModel.resultMap[0]
                    ? rowData.openResultModel.resultMap[0].result
                    : ""
                }}
              </span>
            </p>
          </div>
        </div>
        <div class="row4">
          <div class="left">{{ $t('下注金额') }}</div>
          <div class="right">{{ rowData.bet }}</div>
        </div>
        <div class="row4">
          <div class="left1">{{ $t('总盈亏') }}</div>
          <div class="right1">{{ rowData.payout }}</div>
        </div>
      </div>
      <div class="bet-detail" v-show="sportBet2Show">
        <div class="row4">
          <div class="left">{{ $t('类型') }}</div>
          <div class="right">
            {{ rowData.gameName
            }}{{
              rowData.openResultModel && rowData.openResultModel.resultMap[0]
                ? '-' + rowData.openResultModel.resultMap[0].oddsType
                : ''
            }}({{ $t('注单号') }}:{{ rowData.id }})
          </div>
        </div>
        <div class="row4">
          <div class="left"><span>{{ $t('详情') }}</span></div>
          <div class="right">
            <p>
              {{ rowData ? rowData.betType : "" }}({{
                rowData.openResultModel && rowData.openResultModel.resultMap[0]
                  ? rowData.openResultModel.resultMap[0].betTeam
                  : ''
              }})&nbsp;&nbsp;{{ $t('赔率') }} :
              {{
                rowData.openResultModel && rowData.openResultModel.resultMap[0]
                  ? rowData.openResultModel.resultMap[0].odds
                  : ""
              }}
            </p>
            <p>
              <!-- {{rowData.openResultModel && rowData.openResultModel.resultMap ? rowData.openResultModel.resultMap.matchDateTime: ''}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
              <span :class="[rowData && rowData.result && rowData.result === $t('赢') ? 'green' : 'red']">
                {{
                  rowData.openResultModel &&
                  rowData.openResultModel.resultMap[0]
                    ? rowData.openResultModel.resultMap[0].result
                    : ""
                }}
              </span>
            </p>
          </div>
        </div>
        <div class="row4">
          <div class="left">{{ $t('下注金额') }}</div>
          <div class="right">{{ rowData.bet }}</div>
        </div>
        <div class="row4">
          <div class="left1">{{ $t('总盈亏') }}</div>
          <div class="right1">{{ rowData.payout }}</div>
        </div>
      </div>
      <!--组合注单-->
      <div class="bet-detail" v-show="sportBet3Show">
        <div class="row4">
          <div class="left"><span>{{ $t('详情') }}</span></div>
          <div class="right">
            <div v-if="sportDataShow">
              <div>{{ $t('注单号') }}:{{ rowData.id }}</div>
              <div v-for="(item, index) in rowData.openResultModel.resultMap" :key="index">
                <p style="font-weight: bold; color: #333">
                  {{ item.gameName }}&nbsp;&nbsp;{{
                    item.oddsType
                  }}&nbsp;&nbsp;{{ item.leagueName }}
                </p>
                <p>
                  {{ item.homeIdName ? item.homeIdName + '  VS  ' : '' }}{{ item.awayIdName }} {{ item.betType
                  }}{{ item.betTeam ? '(' + item.betTeam : '' }}{{ item.hdp ? item.hdp + ')' : '' }}&nbsp;&nbsp;{{ $t('赔率') }} :
                  {{ item.odds }}
                </p>
                <p>{{ item.betDatetime ? $t('下注时间') + ':  ' + item.betDatetime : '' }}</p>
                <p>{{ item.matchDateTime ? $t('开赛时间') + ':  ' + item.matchDateTime : '' }}</p>
                <p>
                  {{
                    item.homeScoreResult
                      ? (rowData.platform === 'XJ' ? $t('下注时比分') : $t('完场比分') + ' ') + item.homeScoreResult
                      : ''
                  }}{{ item.awayScoreResult ? ' : ' + item.awayScoreResult : '' }}&nbsp;&nbsp;<span
                    :class="[item.result === $t('赢') ? 'green' : 'red']"
                    >{{ item.result }}</span
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="row4">
          <div class="left">{{ $t('下注金额') }}</div>
          <div class="right">{{ rowData.bet }}</div>
        </div>
        <div class="row4">
          <div class="left1">{{ $t('总盈亏') }}</div>
          <div class="right1">{{ rowData.payout }}</div>
        </div>
      </div>
      <div class="bet-detail" v-show="gameBetShow">
        <div class="row4">
          <div class="left">{{ $t('类型') }}</div>
          <div class="right">
            {{ rowData.openResultModel ? rowData.openResultModel.resultMap[0].category : '' }}&nbsp;&nbsp;{{
              rowData.openResultModel ? rowData.openResultModel.resultMap[0].league : ''
            }}({{ $t('注单号') }}:{{ rowData.id }})
          </div>
        </div>
        <div class="row4">
          <div class="left"><span>{{ $t('详情') }}</span></div>
          <div class="right">
            <div v-if="sportDataShow">
              <div>
                <p style="font-weight: bold; color: #333">
                  {{
                    rowData.openResultModel
                      ? rowData.openResultModel.resultMap[0].match
                      : ""
                  }}&nbsp;&nbsp;{{
                    rowData.openResultModel
                      ? rowData.openResultModel.resultMap[0].bet
                      : ""
                  }}&nbsp;&nbsp;({{
                    rowData.openResultModel
                      ? rowData.openResultModel.resultMap[0].content
                      : ""
                  }})
                </p>
                <!-- <p>
                  下注时间:
                  {{
                    rowData.openResultModel
                      ? rowData.openResultModel.resultMap[0].createAt
                      : ""
                  }}
                </p>
                <p>
                  开赛时间:
                  {{
                    rowData.openResultModel
                      ? rowData.openResultModel.resultMap[0].startAt
                      : ""
                  }}
                </p> -->
                <p>{{ $t('下注时间') }}: {{ rowData.openResultModel ? rowData.openResultModel.resultMap[0].createAt : '' }}</p>
                <p>{{ $t('开赛时间') }}: {{ rowData.openResultModel ? rowData.openResultModel.resultMap[0].startAt : '' }}</p>
                <p v-show="rowData.status !== $t('未结算')">
                  {{ $t('比赛结果') }}:
                  {{ rowData.openResultModel ? rowData.openResultModel.resultMap[0].gameResult : '' }}&nbsp;&nbsp;<span
                    :class="[rowData.openResultModel.resultMap[0].winOrLostResult === $t('赢') ? 'green' : 'red']"
                    >{{ rowData.openResultModel ? rowData.openResultModel.resultMap[0].winOrLostResult : '' }}</span
                  >
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="row4">
          <div class="left">{{ $t('下注金额') }}</div>
          <div class="right">{{ rowData.bet }}</div>
        </div>
        <div class="row4">
          <div class="left1">{{ $t('总盈亏') }}</div>
          <div class="right1">{{ rowData.status === $t('未结算') ? '-' : rowData.payout }}</div>
        </div>
      </div>
    </el-dialog>
    <!-- 串关详情查看 -->
    <el-dialog
      @close="showChuanPop = false"
      :title="$t('串关详情查看')"
      :visible.sync="showChuanPop"
      align="center"
    >
      <div
        class="bet-detail mb10"
        v-for="(item, i) in chuanRow.platformCode === 'SBOD'
          ? chuanRow.leagueName && chuanRow.leagueName.split(',')
          : chuanRow.openResultDetail.resultMap"
        :key="i"
      >
        <div class="row4">
          <div class="right">
            {{ chuanRow.oddsType ? chuanRow.oddsType + "-" : "" }}
            {{ chuanRow.gameName ? chuanRow.gameName.split(",")[i] + "-" : "" }}
            {{ chuanRow.playType ? chuanRow.playType.split(",")[i] + "-" : "" }}
            {{
              chuanRow.matchType
                ? chuanRow.matchType.split(",")[i] == 0
                  ? '-' + $t('滚球')
                  : '-' + $t('非滚球')
                : ""
            }}
          </div>
        </div>
        <div class="row4">
          <div class="left">{{ $t('联赛名称') }}</div>
          <div class="right">
            {{ chuanRow.leagueName ? chuanRow.leagueName.split(",")[i] : "" }}
          </div>
        </div>
        <div class="row4">
          <div class="left">{{ $t('开赛时间') }}</div>
          <div class="right">
            {{ chuanRow.matchTime ? chuanRow.matchTime.split(",")[i] : "-" }}
          </div>
        </div>
        <div class="row4">
          <div class="left">{{ $t('对阵') }}</div>
          <div class="right">
            {{ chuanRow.team ? chuanRow.team.split(",")[i] : "" }}
          </div>
        </div>
        <template v-if="chuanRow.platformCode === 'ISG'">
          <div class="row4">
            <div class="left">{{ $t('投注') }}</div>
            <div class="right">
              <span>{{ item.scoTypeName }}</span>
              <span>{{ item.score }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="row4">
            <div class="left">{{ $t('投注') }}</div>
            <div class="right">
              <span v-if="chuanRow.platformCode === 'TC'">
                {{ transTC2(item.playId) || chuanRow.playType || "-" }}:{{
                  item.playOptionName || transTC(item.betText)
                }}</span
              >
              <span v-else>{{
                chuanRow.platformCode === "SBOD"
                  ? chuanRow.betType
                    ? chuanRow.betType.split(",")[i]
                    : ""
                  : item.playOptionName || item.betText
              }}</span>
              <span>{{
                chuanRow.platformCode === "SBOD"
                  ? chuanRow.playType
                    ? chuanRow.playType.split(",")[i]
                    : ""
                  : item.playName || item.playType || item.id
              }}</span>
            </div>
          </div>
        </template>
        <div
          class="row4"
          v-if="chuanRow.betScore && chuanRow.betScore.split(',')[i]"
        >
          <div class="left">{{ $t('下注时比分') }}</div>
          <div class="right">{{ chuanRow.betScore.split(",")[i] }}</div>
        </div>
        <div class="row4">
          <div class="left">{{ $t('赔率') }}</div>
          <div class="right">
            {{ chuanRow.odds ? chuanRow.odds.split(",")[i] : "-" }}
          </div>
        </div>
        <div class="row4">
          <div class="left"><span>{{ $t('赛果') }}</span></div>
          <div class="right">
            <span v-if="chuanRow.halfResultScore"
              >{{ $t('全场比分') }}：{{ getResultScore(chuanRow, i) }},
              &nbsp;&nbsp;{{ $t('半场比分') }}：{{
                getHalfResultScore(chuanRow.halfResultScore, i)
              }}</span
            >
            <span v-else>{{ getResultScore(chuanRow, i) }}</span>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <div class="button_footer">
          <el-button type="primary" @click="showChuanPop = false"
            >{{ $t('确定') }}</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import lottTranslator from "../../utils/lottTranslator.min";
import Clipboard from "clipboard";
import CopyButton from "../../components/CopyButton";
import systemConfig from "../../config/config.js";
import queryStore from "../../mixins/queryStore";
import StartAndEndTimeSelector from "../../components/StartAndEndTimeSelector";
import StartAndEndTimeSelectorTwo from "../../components/StartAndEndTimeSelectorTwo";
// {label: '投注时间', prop: 'betTime'},{label: '派彩时间',prop: 'payoutTime'},
import { mapGetters } from "vuex";
import moment from "moment";
import { lang } from "@/i18n"
import Mixin from '@/mixins/loadTime'

const basicColumn = [
  { label: lang("结算状态"), prop: "status", align: "center", slotName: 'status' },
  { label: lang("派彩时间"), prop: "payoutTime", width: "95", align: "center" },
  { label: lang("投注详情"), prop: "detail", width: "250", align: "center" },
];
const twoNumberArr = [
  "bet",
  "validBet",
  "payout",
  "jackpotBet",
  "jackpotPayout",
  "balanceBefore",
  "balanceAfter",
];
export default {
  name: "betRecord",
  mixins: [
    Mixin,
    queryStore([
      "activeName",
      "startTime",
      "endTime",
      "betNo",
      "statusValue",
      "memberName",
      "groupValue",
      "gamePlatformValue",
      "gameTypeValue",
      "topAgyAccountValue",
      "agyAccountValue",
      "columnArr",
      "mainPageShow",
      "casioPageShow",
      "electronPageShow",
      "sportPageShow",
      "lotteryPageShow",
      "fishPageShow",
      "supLoginName",
      "isTip",
    ]),
  ],
  components: {
    StartAndEndTimeSelector,
    CopyButton,
    StartAndEndTimeSelectorTwo,
  },
  data() {
    return {
      specialCssList: [
        "gameName",
        "playType",
        "leagueName",
        "team",
        "betType",
        "openResultDetail",
      ],
      isLoading: false,
      extendTitle: this.$t("更多"),
      searchClass: "searchNew",
      showExtend: false,
      activeName: "first",
      tableData: { list: [] },
      total: 0,
      totalCount: 0,
      // 总代理 代理账号 会员组 会员名 游戏平台 游戏分类 游戏名称 终端 注单号 状态 投注时间
      topAgyAccountOptions: [],
      topAgyAccountValue: [],
      agyAccountOptions: [],
      agyAccountValue: [],
      groupOptions: [],
      groupValue: "",
      memberName: "",
      supLoginName: "",
      gamePlatformOptions: [],
      gamePlatformValue: "",
      gameTypeOptions: [],
      gameTypeValue: "",
      gameOptions: [],
      gameValue: "",
      gameName: "",
      terminalOptions: [
        {
          value: "pc",
          label: "pc",
        },
        {
          value: "h5",
          label: "h5",
        },
        {
          value: "app",
          label: "app",
        },
      ],
      terminalValue: "",
      betNo: "",
      statusOptions: [
        {
          value: this.$t("赢"),
          label: this.$t("赢"),
        },
        {
          value: this.$t("输"),
          label: this.$t("输"),
        },
      ],
      statusValue: "",
      startTime: moment().format("YYYY-MM-DD") + " 00:00:00",
      endTime: moment().format("YYYY-MM-DD") + " 23:59:59",
      defaultTypeP: "today",
      payOutStartTime: null,
      payOutEndTime: null,
      gameStartTime: null,
      gameEndTime: null,
      allBetAmount: "",
      allValidBetAmount: "",
      allPayout: "",
      allPourHandsel: "",
      allHandsel: "",
      columnArr: [],
      isym: true,
      mainPageShow: true,
      casioPageShow: false,
      electronPageShow: false,
      sportPageShow: false,
      lotteryPageShow: false,
      fishPageShow: false,
      tipPageShow: false,
      gtBet: "", // 总投注大于等于
      ltBet: "",
      gtValidBet: "", // 有效投注大于等于
      ltValidBet: "",
      gtReward: "", // 派彩大于等于
      ltReward: "",
      gtJpBet: "", // 累积投注大于等于
      ltJpBet: "",
      gtJpReward: "", // 累积派彩大于等于
      ltJpReward: "",
      serialId: "",
      tableNo: "",
      allTotal: {},
      tabs: [],
      rowData: {},
      betDetailShow: false,
      betDetailSportShow: false,
      isNowDowning: true, //文件导出
      /* listReq:{
          pageSize: 20,
          pageNo: 1,
        }, */
      oldTableList: [], //上一次主页展示数据
      enterNum: 0,
      loadingBool: false, //下拉加载图标展示
      saveStartTime: "", //保存当前开始时间
      saveEndTime: "",
      recodeTime: "",
      isTip: "", // 小费
      tipSelect: false,
      isSearching: false,
      showChuanPop: false,
      chuanRow: {
        openResultDetail: { resultMap: [] },
      },
      // currentTab: 'first'
      selectionsArr: [
        {
          label: this.$t("今日"),
          value: "today",
        },
        {
          label: this.$t("昨日"),
          value: "yesterday",
        },
        {
          label: this.$t("七日"),
          value: "lastSevenDays",
        },
        {
          label: this.$t("上周"),
          value: "lastWeek",
        },
        {
          label: this.$t("本月"),
          value: "currentMonth",
        }
      ],
      selectionsArrTwo: [
        {
          label: this.$t("今日"),
          value: "today",
        },
        {
          label: this.$t("昨日"),
          value: "yesterday",
        },
        {
          label: this.$t("七日"),
          value: "lastSevenDays",
        },
        {
          label: this.$t("上周"),
          value: "lastWeek",
        },
        {
          label: this.$t("本月"),
          value: "currentMonth",
        }
      ],
    };
  },
  created() {
    /* window.onscroll=()=>{
        this.$scrToBottom.scrollTo('listReq',this,'handleSizeChange')
      } */
    if (!this.columnArr.length) this.handleClick({ name: "first" }, true);
    if (this.useQueryStoreCache) {
      if (this.mainPageShow) {
        // 全部游戏 获取游戏平台和游戏分类
        this.getPlatform("").then(() => {
          if (this.gamePlatformValue) {
            this.getPlatform(this.gamePlatformValue);
          }
        });
      } else {
        // 其他的只用获取游戏平台
        this.depotChange(this.gameTypeValue);
      }
      this.search();
    } else {
      const {
        memberName = "",
        startTime = "",
        endTime = "",
        platform = "",
        gameCategory = "",
      } = this.$route.query;
      if (memberName || startTime || endTime || platform || gameCategory) {
        this.memberName = memberName;
        this.startTime = startTime;
        this.endTime = endTime;
        if (platform) {
          this.getPlatform("").then(() => {
            if (this.gamePlatformOptions.length > 0) {
              this.gamePlatformValue = Number(platform);
              this.getPlatform(this.gamePlatformValue).then(() => {
                if (this.gameTypeOptions.length > 0) {
                  this.gameTypeValue = String(gameCategory);
                  this.getData();
                } else {
                  this.getData();
                }
              });
            }
          });
        } else {
          this.getData();
        }
      } else {
        this.getPlatform("");
      }
    }
    this.getAgyAccount([]).then(() => {
      if (this.topAgyAccountValue.length) {
        // 根据总代获取子代理
        const { agyAccountValue } = this;

        this.getAgyAccount(this.topAgyAccountValue).then(() => {
          this.agyAccountValue = agyAccountValue;
        });
      } else {
        // 获取所有子代理
        this.getChildAgent();
      }
    });
    this.getMemberOptions();
    /*  this.getGameValue(5) */
  },
  mounted() {
    new Clipboard(".clip");
  },
  updated() {
    const redCollection = [
      "♥",
      "♦",
      "🂱",
      "🂲",
      "🂳",
      "🂴",
      "🂵",
      "🂶",
      "🂷",
      "🂸",
      "🂹",
      "🂺",
      "🂻",
      "🂽",
      "🂾",
      "🃁",
      "🃂",
      "🃃",
      "🃄",
      "🃅",
      "🃆",
      "🃇",
      "🃈",
      "🃉",
      "🃊",
      "🃋",
      "🃍",
      "🃎",
    ];
    const blackCollection = [
      "♠",
      "♣",
      "🂡",
      "🂢",
      "🂣",
      "🂤",
      "🂥",
      "🂦",
      "🂧",
      "🂨",
      "🂩",
      "🂪",
      "🂫",
      "🂭",
      "🂮",
      "🃑",
      "🃒",
      "🃓",
      "🃔",
      "🃕",
      "🃖",
      "🃗",
      "🃘",
      "🃙",
      "🃚",
      "🃛",
      "🃝",
      "🃞",
    ];
    // 获取所有需要加颜色的dom元素
    const pokerList = [...document.getElementsByClassName("resultMarker")];
    // 给牌型加颜色
    pokerList.forEach((item) => {
      let originText = item.innerHTML;
      redCollection.forEach((item) => {
        const reg = new RegExp(item, "g");
        originText = originText.replace(
          reg,
          `<span style="color: #da0202;font-size: 16px;">${item}</span>`
        );
      });
      blackCollection.forEach((item) => {
        const reg = new RegExp(item, "g");
        originText = originText.replace(
          reg,
          `<span style="color: #000;font-size: 16px;">${item}</span>`
        );
      });
      for (let i in this.resultMapper) {
        const reg = new RegExp(i, "g");
        const temp = this.resultMapper[i];
        originText = originText.replace(
          reg,
          `<i class="bet-detail-sprites ${temp.class}" style="background-position: top -${temp.position.top}px left -${temp.position.left}px;"></i>`
        );
      }
      item.innerHTML = originText;
    });
  },
  computed: {
    isLockDisabled() {
      return this.gameTypeOptions.length < 1 || this.tipSelect;
    },
    useQueryStoreCache() {
      return this.$route.query.useQueryStoreCache === "yes";
    },
    resultMapper() {
      /**
       * 与后台约定的规则：类型 + 花色（如果有）+ 牌面，举例：
       * 扑克：红心A P_H_1
       * 麻将：一筒 M_D_1
       * 骰子：1点 S_1
       */
      const mapper = {};
      const gap = 9;
      // 计算56张扑克雪碧图所在的坐标
      const pokerFlowers = ["S", "H", "C", "D"]; // 黑桃、红心、梅花、方块
      const pokerFace = [1, 2, 3, 4, 5, 6, 7, 8, 9, "T", "J", "Q", "K"];
      const pokerWidth = 76;
      const pokerHeight = 107;
      for (let i = 1; i <= 13; i++) {
        pokerFlowers.forEach((item, index) => {
          mapper[`P_${item}_${pokerFace[i - 1]}`] = {
            class: "i-puke",
            position: {
              top:
                i === 1
                  ? (pokerHeight + gap) * 12
                  : (pokerHeight + gap) * (i - 2),
              left: (pokerWidth + gap + 1) * index,
            },
          };
        });
      }
      // 计算10个麻将(只有筒子加白板)雪碧图所在的坐标
      const mjBaseHeight = 13 * (pokerHeight + gap) - 1;
      const mjWidth = 90;
      const mjHeight = 115;
      for (let i = 1; i <= 9; i++) {
        mapper[`M_D_${i}`] = {
          class: "i-majiang",
          position: {
            top: mjBaseHeight + (mjHeight + gap) * Math.floor(i / 6),
            left: (mjWidth + gap) * (i % 5 ? (i % 5) - 1 : 4),
          },
        };
      }
      mapper["M_HWhite"] = {
        class: "i-majiang",
        position: {
          top: mjBaseHeight + mjHeight + gap,
          left: (mjWidth + gap) * 4,
        },
      };
      // 计算6个骰子雪碧图所在的坐标 gap不一致 这里加1进行了修正
      const sicBoBaseHeight = mjBaseHeight + (mjHeight + gap) * 2;
      const sicBoWidth = 90;
      const sicBoHeight = 90;
      for (let i = 1; i <= 6; i++) {
        mapper[`S_${i}`] = {
          class: "i-touzi",
          position: {
            top: sicBoBaseHeight + (sicBoHeight + gap + 1) * Math.floor(i / 4),
            left: (sicBoWidth + gap + 1) * (i % 3 ? (i % 3) - 1 : 2),
          },
        };
      }
      return mapper;
    },
    // 返回数据格式不一样分三种情况
    sportBet1Show() {
      return (
        this.rowData &&
        this.rowData.openResultModel &&
        (this.rowData.openResultModel.type === "ibc_sports" ||
          this.rowData.openResultModel.type === "ibc_virtualSport")
      );
    },
    sportBet2Show() {
      return (
        this.rowData &&
        this.rowData.openResultModel &&
        this.rowData.openResultModel.type === "ibc_numberGame"
      );
    },
    sportBet3Show() {
      return (
        this.rowData &&
        this.rowData.openResultModel &&
        this.rowData.openResultModel.type === "ibc_sports_mixParlay"
      );
    },
    gameBetShow() {
      return (
        this.rowData &&
        this.rowData.openResultModel &&
        this.rowData.openResultModel.type === "aviaavia01"
      );
    },
    sportDataShow() {
      return (
        this.rowData &&
        this.rowData.openResultModel &&
        this.rowData.openResultModel.resultMap.length > 0
      );
    },
    // extendTitle() {
    //   if (this.showExtend) {
    //     return '收起'
    //   } else {
    //     return '更多'
    //   }
    // },
    listReq() {
      return {
        pageNo: 1,
        pageSize: 10,
        pageSizeArr: [10, 100, 300, 500, 1000],
      };
    },
    /*listReq() {
        return this.$store.state.listReq
      }, */
    timeType() {
      return this.$store.state.timeType;
    },
    loading() {
      return this.$store.state.searchLoading;
    },
    fullscreenLoading() {
      return this.$store.state.fullscreenLoading;
    },
    betTypeArr() {
      if (this.rowData && this.rowData.betType) {
        return this.rowData.betType.split("%%%");
      } else {
        return [];
      }
    },
    betsArr() {
      if (
        this.rowData &&
        this.rowData.openResultModel &&
        this.rowData.openResultModel.resultMap.length > 0 &&
        this.rowData.openResultModel.type === "eg1"
      ) {
        return JSON.parse(this.rowData.openResultModel.resultMap[0].bets);
      } else {
        return [];
      }
    },
    ...mapGetters(["hasPermission"]),
  },
  methods: {
    toThousands(money) {
      return systemConfig.toThousands(money);
    },
    showToolTip(prop) {
      return this.specialCssList.includes(prop);
    },
    betTypeFilter(betType, flag) {
      if (betType) {
        let betArr = betType.split("$$$");
        switch (flag) {
          case 0:
            return betArr[0];
          case 1:
            return betArr[1];
          case 2:
            return betArr[2];
          case 3:
            return betArr[3];
        }
      } else {
        return "";
      }
    },
    checkResultData() {
      if (this.rowData && this.rowData.openResultModel) {
        let resultMap = this.rowData.openResultModel.resultMap[0];
        return resultMap;
      } else {
        return "";
      }
    },
    // 头牌
    parseResultToupai() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        if (resultMap.headOpenResult) {
          return this.replaceStr(resultMap.headOpenResult);
        } else {
          return "";
        }
      } else {
        return resultMap;
      }
    },
    // 鱼虾蟹
    parseFish() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult1 = "";
        let allResult2 = "";
        let allResult3 = "";
        if (resultMap.result1) {
          allResult1 = parseInt(resultMap.result1);
        } else {
          allResult1 = "";
        }
        if (resultMap.result2) {
          allResult2 = parseInt(resultMap.result2);
        } else {
          allResult2 = "";
        }
        if (resultMap.result3) {
          allResult3 = parseInt(resultMap.result3);
        } else {
          allResult3 = "";
        }
        return (
          allResult1 +
          allResult2 +
          allResult3 +
          "(" +
          (allResult1 + "," + allResult2 + "," + allResult3) +
          ")"
        );
      } else {
        return resultMap;
      }
    },
    // 无限21点
    parseZ() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        if (resultMap.result1) {
          return this.replaceStr(resultMap.result1);
        } else {
          return "";
        }
      } else {
        return resultMap;
      }
    },
    parseX() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        if (resultMap.result2) {
          return this.replaceStr(resultMap.result2);
        } else {
          return "";
        }
      } else {
        return resultMap;
      }
    },
    parseZ21() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.BOpenResult1) {
          allResult += this.replaceStr(resultMap.BOpenResult1);
        } else {
          allResult += "";
        }
        if (resultMap.BOpenResult2) {
          allResult += "," + this.replaceStr(resultMap.BOpenResult2);
        } else {
          allResult += "";
        }
        if (resultMap.BOpenResult3) {
          allResult += this.replaceStr(resultMap.BOpenResult3);
        } else {
          allResult += "";
        }
        if (resultMap.BOpenResult4) {
          allResult += "," + this.replaceStr(resultMap.BOpenResult4);
        } else {
          allResult += "";
        }
        if (resultMap.BOpenResult5) {
          allResult += "," + this.replaceStr(resultMap.BOpenResult5);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    parseX21() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.P1OpenResult1) {
          allResult += this.replaceStr(resultMap.P1OpenResult1);
        } else {
          allResult += "";
        }
        if (resultMap.P1OpenResult2) {
          allResult += "," + this.replaceStr(resultMap.P1OpenResult2);
        } else {
          allResult += "";
        }
        if (resultMap.P1OpenResult3) {
          allResult += this.replaceStr(resultMap.P1OpenResult3);
        } else {
          allResult += "";
        }
        if (resultMap.P1OpenResult4) {
          allResult += "," + this.replaceStr(resultMap.P1OpenResult4);
        } else {
          allResult += "";
        }
        if (resultMap.P1OpenResult5) {
          allResult += "," + this.replaceStr(resultMap.P1OpenResult5);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    parseX211() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.P1OpenResult1) {
          allResult += this.replaceStr(resultMap.P1OpenResult1);
        } else {
          allResult += "";
        }
        if (resultMap.P1OpenResult2) {
          allResult += "," + this.replaceStr(resultMap.P1OpenResult2);
        } else {
          allResult += "";
        }
        if (resultMap.P1OpenResult3) {
          allResult += this.replaceStr(resultMap.P1OpenResult3);
        } else {
          allResult += "";
        }
        if (resultMap.P1OpenResult4) {
          allResult += "," + this.replaceStr(resultMap.P1OpenResult4);
        } else {
          allResult += "";
        }
        if (resultMap.P1OpenResult5) {
          allResult += "," + this.replaceStr(resultMap.P1OpenResult5);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    parseX212() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.P2OpenResult1) {
          allResult += this.replaceStr(resultMap.P2OpenResult1);
        } else {
          allResult += "";
        }
        if (resultMap.P2OpenResult2) {
          allResult += "," + this.replaceStr(resultMap.P2OpenResult2);
        } else {
          allResult += "";
        }
        if (resultMap.P2OpenResult3) {
          allResult += this.replaceStr(resultMap.P2OpenResult3);
        } else {
          allResult += "";
        }
        if (resultMap.P2OpenResult4) {
          allResult += "," + this.replaceStr(resultMap.P2OpenResult4);
        } else {
          allResult += "";
        }
        if (resultMap.P2OpenResult5) {
          allResult += "," + this.replaceStr(resultMap.P2OpenResult5);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    parseX213() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.P3OpenResult1) {
          allResult += this.replaceStr(resultMap.P3OpenResult1);
        } else {
          allResult += "";
        }
        if (resultMap.P3OpenResult2) {
          allResult += "," + this.replaceStr(resultMap.P3OpenResult2);
        } else {
          allResult += "";
        }
        if (resultMap.P3OpenResult3) {
          allResult += this.replaceStr(resultMap.P3OpenResult3);
        } else {
          allResult += "";
        }
        if (resultMap.P3OpenResult4) {
          allResult += "," + this.replaceStr(resultMap.P3OpenResult4);
        } else {
          allResult += "";
        }
        if (resultMap.P3OpenResult5) {
          allResult += "," + this.replaceStr(resultMap.P3OpenResult5);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    parseX214() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.P4OpenResult1) {
          allResult += this.replaceStr(resultMap.P4OpenResult1);
        } else {
          allResult += "";
        }
        if (resultMap.P4OpenResult2) {
          allResult += "," + this.replaceStr(resultMap.P4OpenResult2);
        } else {
          allResult += "";
        }
        if (resultMap.P4OpenResult3) {
          allResult += this.replaceStr(resultMap.P4OpenResult3);
        } else {
          allResult += "";
        }
        if (resultMap.P4OpenResult4) {
          allResult += "," + this.replaceStr(resultMap.P4OpenResult4);
        } else {
          allResult += "";
        }
        if (resultMap.P4OpenResult5) {
          allResult += "," + this.replaceStr(resultMap.P4OpenResult5);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    parseX215() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.P5OpenResult1) {
          allResult += this.replaceStr(resultMap.P5OpenResult1);
        } else {
          allResult += "";
        }
        if (resultMap.P5OpenResult2) {
          allResult += "," + this.replaceStr(resultMap.P5OpenResult2);
        } else {
          allResult += "";
        }
        if (resultMap.P5OpenResult3) {
          allResult += this.replaceStr(resultMap.P5OpenResult3);
        } else {
          allResult += "";
        }
        if (resultMap.P5OpenResult4) {
          allResult += "," + this.replaceStr(resultMap.P5OpenResult4);
        } else {
          allResult += "";
        }
        if (resultMap.P5OpenResult5) {
          allResult += "," + this.replaceStr(resultMap.P5OpenResult5);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    parseX216() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.P6OpenResult1) {
          allResult += this.replaceStr(resultMap.P6OpenResult1);
        } else {
          allResult += "";
        }
        if (resultMap.P6OpenResult2) {
          allResult += "," + this.replaceStr(resultMap.P6OpenResult2);
        } else {
          allResult += "";
        }
        if (resultMap.P6OpenResult3) {
          allResult += this.replaceStr(resultMap.P6OpenResult3);
        } else {
          allResult += "";
        }
        if (resultMap.P6OpenResult4) {
          allResult += "," + this.replaceStr(resultMap.P6OpenResult4);
        } else {
          allResult += "";
        }
        if (resultMap.P6OpenResult5) {
          allResult += "," + this.replaceStr(resultMap.P6OpenResult5);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    parseX217() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.P7OpenResult1) {
          allResult += this.replaceStr(resultMap.P7OpenResult1);
        } else {
          allResult += "";
        }
        if (resultMap.P7OpenResult2) {
          allResult += "," + this.replaceStr(resultMap.P7OpenResult2);
        } else {
          allResult += "";
        }
        if (resultMap.P7OpenResult3) {
          allResult += this.replaceStr(resultMap.P7OpenResult3);
        } else {
          allResult += "";
        }
        if (resultMap.P7OpenResult4) {
          allResult += "," + this.replaceStr(resultMap.P7OpenResult4);
        } else {
          allResult += "";
        }
        if (resultMap.P7OpenResult5) {
          allResult += "," + this.replaceStr(resultMap.P7OpenResult5);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    //炸金花
    parseDragon() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.dResult) {
          let arr = resultMap.dResult.split("-");
          allResult = this.replaceStr5(arr[0]) + arr[1];
        } else {
          allResult = "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    parseFeng() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.pResult) {
          let arr = resultMap.pResult.split("-");
          allResult = this.replaceStr5(arr[0]) + arr[1];
        } else {
          allResult = "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    parseDragon2() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.dResult) {
          allResult = this.replaceStr6(parseInt(resultMap.dResult));
        } else {
          allResult = "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    parseFeng2() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.pResult) {
          allResult = this.replaceStr6(parseInt(resultMap.pResult));
        } else {
          allResult = "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    parseResultDragon() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.dOpenResult0) {
          allResult += this.replaceStr(resultMap.dOpenResult0);
        } else {
          allResult += "";
        }
        if (resultMap.dOpenResult1) {
          allResult += "," + this.replaceStr(resultMap.dOpenResult1);
        } else {
          allResult += "";
        }
        if (resultMap.dOpenResult2) {
          allResult += this.replaceStr(resultMap.dOpenResult2);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    parseResultFeng() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.pOpenResult0) {
          allResult += this.replaceStr(resultMap.pOpenResult0);
        } else {
          allResult += "";
        }
        if (resultMap.pOpenResult1) {
          allResult += "," + this.replaceStr(resultMap.pOpenResult1);
        } else {
          allResult += "";
        }
        if (resultMap.pOpenResult2) {
          allResult += this.replaceStr(resultMap.pOpenResult2);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    replaceStr6(flag) {
      switch (flag) {
        case 0:
          return this.$t("无牌型");
        case 9:
          return this.$t("豹子杀手");
        case 21:
          return this.$t("散牌5");
        case 22:
          return this.$t("散牌6");
        case 23:
          return this.$t("散牌7");
        case 24:
          return this.$t("散牌8");
        case 25:
          return this.$t("散牌9");
        case 26:
          return this.$t("散牌10");
        case 27:
          return this.$t("散牌J");
        case 28:
          return this.$t("散牌Q");
        case 29:
          return this.$t("散牌K");
        case 30:
          return this.$t("散牌A");
        case 34:
          return this.$t("对子2");
        case 35:
          return this.$t("对子3");
        case 36:
          return this.$t("对子4");
        case 37:
          return this.$t("对子5");
        case 38:
          return this.$t("对子6");
        case 39:
          return this.$t("对子7");
        case 40:
          return this.$t("对子8");
        case 41:
          return this.$t("对子9");
        case 42:
          return this.$t("对子10");
        case 43:
          return this.$t("对子J");
        case 44:
          return this.$t("对子Q");
        case 45:
          return this.$t("对子K");
        case 46:
          return this.$t("对子A");
        case 48:
          return this.$t("顺子");
        case 64:
          return this.$t("同花");
        case 80:
          return this.$t("同花顺");
        case 96:
          return this.$t("豹子");
      }
    },
    replaceStr5(flag) {
      switch (flag) {
        case "AnyTripleKiller":
          return this.$t("豹子杀手");
        case "HighCard":
          return this.$t("散牌");
        case "Pair":
          return this.$t("对子");
        case "Straight":
          return this.$t("顺子");
        case "Flush":
          return this.$t("同花");
        case "StraightFlush":
          return this.$t("同花顺");
        case "AnyTriple":
          return this.$t("豹子");
      }
    },
    // 牛牛
    parseResultZnn() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        if (this.rowData.openResultModel.type === "aginnn") {
          if (resultMap.zResult1) {
            return this.replaceStr41(resultMap.zResult0);
          } else {
            return "";
          }
        } else {
          if (resultMap.zResult1) {
            return this.replaceStr4(resultMap.zResult1);
          } else {
            return "";
          }
        }
      } else {
        return resultMap;
      }
    },
    parseResultX1nn() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        if (this.rowData.openResultModel.type === "aginnn") {
          if (resultMap.xResult1) {
            return this.replaceStr41(resultMap.xResult1);
          } else {
            return "";
          }
        } else {
          if (resultMap.xResult2) {
            return this.replaceStr4(resultMap.xResult2);
          } else {
            return "";
          }
        }
      } else {
        return resultMap;
      }
    },
    parseResultX2nn() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        if (this.rowData.openResultModel.type === "aginnn") {
          if (resultMap.xResult2) {
            return this.replaceStr41(resultMap.xResult2);
          } else {
            return "";
          }
        } else {
          if (resultMap.xResult3) {
            return this.replaceStr4(resultMap.xResult3);
          } else {
            return "";
          }
        }
      } else {
        return resultMap;
      }
    },
    parseResultX3nn() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        if (this.rowData.openResultModel.type === "aginnn") {
          if (resultMap.xResult3) {
            return this.replaceStr41(resultMap.xResult3);
          } else {
            return "";
          }
        } else {
          if (resultMap.xResult4) {
            return this.replaceStr4(resultMap.xResult4);
          } else {
            return "";
          }
        }
      } else {
        return resultMap;
      }
    },
    // 牛牛牌型
    parseResultZResult() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.zOpenResult1) {
          allResult += this.replaceStr(resultMap.zOpenResult1);
        } else {
          allResult += "";
        }
        if (resultMap.zOpenResult2) {
          allResult += "," + this.replaceStr(resultMap.zOpenResult2);
        } else {
          allResult += "";
        }
        if (resultMap.zOpenResult3) {
          allResult += this.replaceStr(resultMap.zOpenResult3);
        } else {
          allResult += "";
        }
        if (resultMap.zOpenResult4) {
          allResult += "," + this.replaceStr(resultMap.zOpenResult4);
        } else {
          allResult += "";
        }
        if (resultMap.zOpenResult5) {
          allResult += "," + this.replaceStr(resultMap.zOpenResult5);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    parseResultXResult1() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.xOpenResult21) {
          allResult += this.replaceStr(resultMap.xOpenResult21);
        } else {
          allResult += "";
        }
        if (resultMap.xOpenResult22) {
          allResult += "," + this.replaceStr(resultMap.xOpenResult22);
        } else {
          allResult += "";
        }
        if (resultMap.xOpenResult23) {
          allResult += this.replaceStr(resultMap.xOpenResult23);
        } else {
          allResult += "";
        }
        if (resultMap.xOpenResult24) {
          allResult += "," + this.replaceStr(resultMap.xOpenResult24);
        } else {
          allResult += "";
        }
        if (resultMap.xOpenResult25) {
          allResult += "," + this.replaceStr(resultMap.xOpenResult25);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    parseResultXResult2() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.xOpenResult31) {
          allResult += this.replaceStr(resultMap.xOpenResult31);
        } else {
          allResult += "";
        }
        if (resultMap.xOpenResult32) {
          allResult += "," + this.replaceStr(resultMap.xOpenResult32);
        } else {
          allResult += "";
        }
        if (resultMap.xOpenResult33) {
          allResult += this.replaceStr(resultMap.xOpenResult33);
        } else {
          allResult += "";
        }
        if (resultMap.xOpenResult34) {
          allResult += "," + this.replaceStr(resultMap.xOpenResult34);
        } else {
          allResult += "";
        }
        if (resultMap.xOpenResult35) {
          allResult += "," + this.replaceStr(resultMap.xOpenResult35);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    parseResultXResult3() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.xOpenResult41) {
          allResult += this.replaceStr(resultMap.xOpenResult41);
        } else {
          allResult += "";
        }
        if (resultMap.xOpenResult42) {
          allResult += "," + this.replaceStr(resultMap.xOpenResult42);
        } else {
          allResult += "";
        }
        if (resultMap.xOpenResult43) {
          allResult += this.replaceStr(resultMap.xOpenResult43);
        } else {
          allResult += "";
        }
        if (resultMap.xOpenResult44) {
          allResult += "," + this.replaceStr(resultMap.xOpenResult44);
        } else {
          allResult += "";
        }
        if (resultMap.xOpenResult45) {
          allResult += "," + this.replaceStr(resultMap.xOpenResult45);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    replaceStr4(flag) {
      switch (flag) {
        case "No Bull":
          return this.$t("无牛");
        case "Bull1":
          return this.$t("牛1");
        case "Bull2":
          return this.$t("牛2");
        case "Bull3":
          return this.$t("牛3");
        case "Bull4":
          return this.$t("牛4");
        case "Bull5":
          return this.$t("牛5");
        case "Bull6":
          return this.$t("牛6");
        case "Bull7":
          return this.$t("牛7");
        case "Bull8":
          return this.$t("牛8");
        case "Bull9":
          return this.$t("牛9");
        case "Bull Bull":
          return this.$t("牛牛");
      }
    },
    replaceStr41(flag) {
      switch (flag) {
        case "0":
          return this.$t("无牛");
        case "1":
          return this.$t("牛1");
        case "2":
          return this.$t("牛2");
        case "3":
          return this.$t("牛3");
        case "4":
          return this.$t("牛4");
        case "5":
          return this.$t("牛5");
        case "6":
          return this.$t("牛6");
        case "7":
          return this.$t("牛7");
        case "8":
          return this.$t("牛8");
        case "9":
          return this.$t("牛9");
        case "20":
          return this.$t("牛牛");
        case "50":
          return this.$t("公");
      }
    },
    // 骰宝
    parseSaibao(flag) {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult1 = "";
        let allResult2 = "";
        let allResult3 = "";
        if (resultMap.sResult1) {
          allResult1 = parseInt(resultMap.sResult1);
        } else {
          allResult1 = "";
        }
        if (resultMap.sResult2) {
          allResult2 = parseInt(resultMap.sResult2);
        } else {
          allResult2 = "";
        }
        if (resultMap.sResult3) {
          allResult3 = parseInt(resultMap.sResult3);
        } else {
          allResult3 = "";
        }
        if (flag === "all") {
          return allResult1 + allResult2 + allResult3;
        } else {
          return "" + allResult1 + "," + allResult2 + "," + allResult3;
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    // bb-sangong-庄
    parseResultZbb() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let zResult = "";
        if (resultMap.zOpenResult1) {
          zResult += this.replaceStr(resultMap.zOpenResult1) + " ";
        } else {
          zResult += "";
        }
        if (resultMap.zOpenResult1) {
          zResult += this.replaceStr(resultMap.zOpenResult2) + " ";
        } else {
          zResult += "";
        }
        if (resultMap.zOpenResult1) {
          zResult += this.replaceStr(resultMap.zOpenResult3) + " ";
        } else {
          zResult += "";
        }
        return zResult;
      } else {
        return resultMap;
      }
    },
    // bb-sangong-庄
    parseResultZsangong() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let zResult = "";
        if (resultMap.zResult) {
          zResult += this.replaceStr2(resultMap.zResult);
        } else {
          zResult += "";
        }
        return zResult;
      } else {
        return resultMap;
      }
    },
    // bb-sangong-闲1
    parseResultX1sangong() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let XResult = "";
        if (resultMap.xResult1) {
          XResult += this.replaceStr2(resultMap.xResult1);
        } else {
          XResult += "";
        }
        return XResult;
      } else {
        return resultMap;
      }
    },
    // bb-sangong-闲2
    parseResultX2sangong() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let XResult = "";
        if (resultMap.xResult2) {
          XResult += this.replaceStr2(resultMap.xResult2);
        } else {
          XResult += "";
        }
        return XResult;
      } else {
        return resultMap;
      }
    },
    // bb-sangong-闲3
    parseResultX3sangong() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let XResult = "";
        if (resultMap.xResult3) {
          XResult += this.replaceStr2(resultMap.xResult3);
        } else {
          XResult += "";
        }
        return XResult;
      } else {
        return resultMap;
      }
    },
    // bb-sangong-闲1
    parseResultXbb1() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let xResult = "";
        if (resultMap.xOpenResult11) {
          xResult += this.replaceStr(resultMap.xOpenResult11) + " ";
        } else {
          xResult += "";
        }
        if (resultMap.xOpenResult12) {
          xResult += this.replaceStr(resultMap.xOpenResult12) + " ";
        } else {
          xResult += "";
        }
        if (resultMap.xOpenResult13) {
          xResult += this.replaceStr(resultMap.xOpenResult13) + " ";
        } else {
          xResult += "";
        }
        return xResult;
      } else {
        return resultMap;
      }
    },
    // bb-sangong-闲2
    parseResultXbb2() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let xResult = "";
        if (resultMap.xOpenResult21) {
          xResult += this.replaceStr(resultMap.xOpenResult21) + " ";
        } else {
          xResult += "";
        }
        if (resultMap.xOpenResult22) {
          xResult += this.replaceStr(resultMap.xOpenResult22) + " ";
        } else {
          xResult += "";
        }
        if (resultMap.xOpenResult23) {
          xResult += this.replaceStr(resultMap.xOpenResult23) + " ";
        } else {
          xResult += "";
        }
        return xResult;
      } else {
        return resultMap;
      }
    },
    // bb-sangong-闲3
    parseResultXbb3() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let xResult = "";
        if (resultMap.xOpenResult31) {
          xResult += this.replaceStr(resultMap.xOpenResult31) + " ";
        } else {
          xResult += "";
        }
        if (resultMap.xOpenResult32) {
          xResult += this.replaceStr(resultMap.xOpenResult32) + " ";
        } else {
          xResult += "";
        }
        if (resultMap.xOpenResult33) {
          xResult += this.replaceStr(resultMap.xOpenResult33) + " ";
        } else {
          xResult += "";
        }
        return xResult;
      } else {
        return resultMap;
      }
    },
    // eg闲
    parseResultXeg() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let xResult = "";
        if (resultMap.xOpenResult1) {
          xResult += this.replaceStr7(resultMap.xOpenResult1) + " ";
        } else {
          xResult += "";
        }
        if (resultMap.xOpenResult2) {
          xResult += this.replaceStr7(resultMap.xOpenResult2) + " ";
        } else {
          xResult += "";
        }
        if (resultMap.xOpenResult3) {
          xResult += this.replaceStr7(resultMap.xOpenResult3) + " ";
        } else {
          xResult += "";
        }
        return xResult;
      } else {
        return resultMap;
      }
    },
    // eg庄
    parseResultZeg() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let xResult = "";
        if (resultMap.zOpenResult1) {
          xResult += this.replaceStr7(resultMap.zOpenResult1) + " ";
        } else {
          xResult += "";
        }
        if (resultMap.zOpenResult2) {
          xResult += this.replaceStr7(resultMap.zOpenResult2) + " ";
        } else {
          xResult += "";
        }
        if (resultMap.zOpenResult3) {
          xResult += this.replaceStr7(resultMap.zOpenResult3) + " ";
        } else {
          xResult += "";
        }
        return xResult;
      } else {
        return resultMap;
      }
    },
    replaceStr7(str) {
      if (str) {
        if (str.indexOf("Tc") > -1) {
          return str.replace("Tc", "♣10");
        }
        if (str.indexOf("Jc") > -1) {
          return str.replace("Jc", "♣J");
        }
        if (str.indexOf("Qc") > -1) {
          return str.replace("Qc", "♣Q");
        }
        if (str.indexOf("Kc") > -1) {
          return str.replace("Kc", "♣K");
        }
        if (str.indexOf("Ac") > -1) {
          return str.replace("Ac", "♣A");
        }
        if (str.indexOf("Td") > -1) {
          return str.replace("Td", "♦10");
        }
        if (str.indexOf("Jd") > -1) {
          return str.replace("Jd", "♦J");
        }
        if (str.indexOf("Qd") > -1) {
          return str.replace("Qd", "♦Q");
        }
        if (str.indexOf("Kd") > -1) {
          return str.replace("Kd", "♦K");
        }
        if (str.indexOf("Ad") > -1) {
          return str.replace("Ad", "♦A");
        }
        if (str.indexOf("Th") > -1) {
          return str.replace("Th", "♥10");
        }
        if (str.indexOf("Jh") > -1) {
          return str.replace("Jh", "♥J");
        }
        if (str.indexOf("Qh") > -1) {
          return str.replace("Qh", "♥Q");
        }
        if (str.indexOf("Kh") > -1) {
          return str.replace("K", "♥K");
        }
        if (str.indexOf("Ah") > -1) {
          return str.replace("Ah", "♥A");
        }
        if (str.indexOf("Ts") > -1) {
          return str.replace("Ts", "♠10");
        }
        if (str.indexOf("Js") > -1) {
          return str.replace("Js", "♠J");
        }
        if (str.indexOf("Qs") > -1) {
          return str.replace("Qs", "♠Q");
        }
        if (str.indexOf("Ks") > -1) {
          return str.replace("Ks", "♠K");
        }
        if (str.indexOf("As") > -1) {
          return str.replace("As", "♠A");
        }
        str = str.split("").reverse().join("");
        if (str.indexOf("s") > -1) {
          return str.replace("s", "♠");
        }
        if (str.indexOf("c") > -1) {
          return str.replace("c", "♣");
        }
        if (str.indexOf("h") > -1) {
          return str.replace("h", "♥");
        }
        if (str.indexOf("d") > -1) {
          return str.replace("d", "♦");
        }
      } else {
        return "";
      }
    },
    // ag闲
    parseResultXag() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let xResult = "";
        if (resultMap.xOpenResult1) {
          xResult += this.replaceStr(resultMap.xOpenResult1) + " ";
        } else {
          xResult += "";
        }
        if (resultMap.xOpenResult2) {
          xResult += this.replaceStr(resultMap.xOpenResult2) + " ";
        } else {
          xResult += "";
        }
        if (resultMap.xOpenResult3) {
          xResult += this.replaceStr(resultMap.xOpenResult3) + " ";
        } else {
          xResult += "";
        }
        return xResult;
      } else {
        return resultMap;
      }
    },
    // ag庄
    parseResultZag() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let zResult = "";
        if (resultMap.zOpenResult1) {
          zResult += this.replaceStr(resultMap.zOpenResult1) + " ";
        } else {
          zResult += "";
        }
        if (resultMap.zOpenResult2) {
          zResult += this.replaceStr(resultMap.zOpenResult2) + " ";
        } else {
          zResult += "";
        }
        if (resultMap.zOpenResult3) {
          zResult += this.replaceStr(resultMap.zOpenResult3) + " ";
        } else {
          zResult += "";
        }
        return zResult;
      } else {
        return resultMap;
      }
    },
    // 龙
    parseResultLong() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        if (resultMap.dragonpoint) {
          return this.replaceStr(resultMap.dragonpoint);
        } else {
          return "";
        }
      } else {
        return resultMap;
      }
    },
    // 虎
    parseResultHu() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        if (resultMap.tigerpoint) {
          return this.replaceStr(resultMap.tigerpoint);
        } else {
          return "";
        }
      } else {
        return resultMap;
      }
    },
    // bbin温州牌九---start
    parseBBZPaijiu() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let zResult = "";
        if (resultMap.zOpenResult1) {
          zResult += this.replaceStr(resultMap.zOpenResult1) + " ";
        } else {
          zResult += "";
        }
        if (resultMap.zOpenResult2) {
          zResult += this.replaceStr(resultMap.zOpenResult2) + " ";
        } else {
          zResult += "";
        }
        return zResult;
      } else {
        return resultMap;
      }
    },
    parseBBShunPaijiu() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let sResult = "";
        if (resultMap.sOpenResult1) {
          sResult += this.replaceStr(resultMap.sOpenResult1) + " ";
        } else {
          sResult += "";
        }
        if (resultMap.sOpenResult2) {
          sResult += this.replaceStr(resultMap.sOpenResult2) + " ";
        } else {
          sResult += "";
        }
        return sResult;
      } else {
        return resultMap;
      }
    },
    parseBBChuPaijiu() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let cResult = "";
        if (resultMap.cOpenResult1) {
          cResult += this.replaceStr(resultMap.cOpenResult1) + " ";
        } else {
          cResult += "";
        }
        if (resultMap.cOpenResult2) {
          cResult += this.replaceStr(resultMap.cOpenResult2) + " ";
        } else {
          cResult += "";
        }
        return cResult;
      } else {
        return resultMap;
      }
    },
    parseBBDaoPaijiu() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let dResult = "";
        if (resultMap.dOpenResult1) {
          dResult += this.replaceStr(resultMap.dOpenResult1) + " ";
        } else {
          dResult += "";
        }
        if (resultMap.dOpenResult2) {
          dResult += this.replaceStr(resultMap.dOpenResult2) + " ";
        } else {
          dResult += "";
        }
        return dResult;
      } else {
        return resultMap;
      }
    },
    parseBBRPaijiu() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.dOpenResult1) {
          allResult += this.replaceStr3(resultMap.result1);
        } else {
          allResult += "";
        }
        if (resultMap.dOpenResult2) {
          allResult += "," + this.replaceStr3(resultMap.result2);
        } else {
          allResult += "";
        }
        if (resultMap.dOpenResult2) {
          allResult += "," + this.replaceStr3(resultMap.result3);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    // bbin温州牌九---end
    // 德州扑克
    parseDezhouPoke1() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.zOpenResult1) {
          allResult += this.replaceStr(resultMap.zOpenResult1);
        } else {
          allResult += "";
        }
        if (resultMap.zOpenResult2) {
          allResult += "," + this.replaceStr(resultMap.zOpenResult2);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    parseDezhouPoke2() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.gOpenResult1) {
          allResult += this.replaceStr(resultMap.gOpenResult1);
        } else {
          allResult += "";
        }
        if (resultMap.gOpenResult2) {
          allResult += "," + this.replaceStr(resultMap.gOpenResult2);
        } else {
          allResult += "";
        }
        if (resultMap.gOpenResult3) {
          allResult += this.replaceStr(resultMap.gOpenResult3);
        } else {
          allResult += "";
        }
        if (resultMap.gOpenResult4) {
          allResult += "," + this.replaceStr(resultMap.gOpenResult4);
        } else {
          allResult += "";
        }
        if (resultMap.gOpenResult5) {
          allResult += "," + this.replaceStr(resultMap.gOpenResult5);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    parseDezhouPoke3() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.xOpenResult1) {
          allResult += this.replaceStr(resultMap.xOpenResult1);
        } else {
          allResult += "";
        }
        if (resultMap.xOpenResult2) {
          allResult += "," + this.replaceStr(resultMap.xOpenResult2);
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    // 德州扑克 end
    // 色碟
    parseSedie() {
      let resultMap = this.checkResultData();
      if (resultMap) {
        let allResult = "";
        if (resultMap.whiteCounts) {
          allResult += resultMap.whiteCounts + this.$t("白");
        } else {
          allResult += "";
        }
        if (resultMap.redCounts) {
          allResult += "," + resultMap.redCounts + this.$t("红");
        } else {
          allResult += "";
        }
        return allResult;
      } else {
        return resultMap;
      }
    },
    // 解析扑克
    replaceStr(str) {
      if (str) {
        if (str.indexOf("S.11") > -1) {
          return str.replace("S.11", "♠J");
        }
        if (str.indexOf("S.12") > -1) {
          return str.replace("S.", "♠Q");
        }
        if (str.indexOf("S.13") > -1) {
          return str.replace("S.", "♠K");
        }
        if (str.indexOf("S") > -1) {
          return str.replace("S.", "♠");
        }
        if (str.indexOf("H.11") > -1) {
          return str.replace("H.11", "♥J");
        }
        if (str.indexOf("H.12") > -1) {
          return str.replace("H.12", "♥Q");
        }
        if (str.indexOf("H.13") > -1) {
          return str.replace("H.13", "♥K");
        }
        if (str.indexOf("H") > -1) {
          return str.replace("H.", "♥");
        }
        if (str.indexOf("C.11") > -1) {
          return str.replace("C.11", "♣J");
        }
        if (str.indexOf("C.12") > -1) {
          return str.replace("C.12", "♣Q");
        }
        if (str.indexOf("C.13") > -1) {
          return str.replace("C.13", "♣K");
        }
        if (str.indexOf("C") > -1) {
          return str.replace("C.", "♣");
        }
        if (str.indexOf("D.11") > -1) {
          return str.replace("D.11", "♦J");
        }
        if (str.indexOf("D.12") > -1) {
          return str.replace("D.12", "♦Q");
        }
        if (str.indexOf("D.13") > -1) {
          return str.replace("D.13", "♦K");
        }
        if (str.indexOf("D") > -1) {
          return str.replace("D.", "♦");
        }
      } else {
        return "";
      }
    },
    // 解析三公
    replaceStr2(str) {
      if (str) {
        if (str.indexOf("3P") > -1) {
          return str.replace("3P", this.$t("三公"));
        }
        if (str.indexOf("2P") > -1) {
          return str.replace("2P", this.$t("双公"));
        }
        if (str.indexOf("P") > -1) {
          return str.replace("P", this.$t("单公"));
        }
        return str;
      } else {
        return "";
      }
    },
    // 解析温州牌九
    replaceStr3(str) {
      if (str) {
        switch (str.trim()) {
          case "P1W":
            return this.$t("闲家一赢");
          case "P1L":
            return this.$t("闲家一输");
          case "P2W":
            return this.$t("闲家二赢");
          case "P2L":
            return this.$t("闲家二输");
          case "P3W":
            return this.$t("闲家三赢");
          case "P3L":
            return this.$t("闲家三输");
          default:
            return "??";
        }
      } else {
        return "";
      }
    },
    openBetDetail(row) {
      this.rowData = Object.assign({}, row);
      if (
        this.rowData.platform &&
        (this.rowData.platform.indexOf("IBC") > -1 ||
          this.rowData.platform.indexOf("AVIA") > -1 ||
          this.rowData.platform.indexOf("XJ") > -1)
      ) {
        this.betDetailSportShow = true;
      } else {
        this.betDetailShow = true;
      }
    },
    getChildAgent() {
      this.$axios
        .get(systemConfig.urls.getAllChildAgentIncludeDisable)
        .then((resp) => {
          this.agyAccountOptions = resp.data.accounts;
          this.trueAgyAccountOptions = resp.data.accounts;
        });
    },
    handleClick(tab, init) {
      this.c = tab;
      this.reset(true);
      this.tableData = [];
      const betTypeAndResultOpen = [
        { label: this.$t("开奖结果"), prop: "resultScore", align: "center" },
      ];
      // 全部-电竞-体育
      let allElectSport = [].concat(basicColumn);
      allElectSport.splice(2, 0, ...betTypeAndResultOpen);
      switch (tab.name) {
        case "first": // 全部 - change
          let arr0 = [].concat(allElectSport);
          // arr0.splice(1,0,rateType)
          this.columnArr = arr0;
          this.mainPageShow = true;
          this.casioPageShow = false;
          this.electronPageShow = false;
          this.sportPageShow = false;
          this.lotteryPageShow = false;
          this.fishPageShow = false;
          this.electGameShow = false;
          this.gameTypeValue = "";
          this.getPlatform("");
          break;
        case "second": // 真人 - change
          let temArr1 = [].concat(basicColumn);
          // temArr1.splice(0, 0, odds);
          temArr1.splice(2, 0, ...betTypeAndResultOpen);
          this.columnArr = temArr1;
          this.mainPageShow = false;
          this.casioPageShow = true;
          this.electronPageShow = false;
          this.sportPageShow = false;
          this.lotteryPageShow = false;
          this.fishPageShow = false;
          this.electGameShow = false;
          this.gameTypeValue = 3;
          this.depotChange(3);
          break;
        case "third": // 电子 - change
          this.columnArr = basicColumn;
          this.mainPageShow = false;
          this.casioPageShow = false;
          this.electronPageShow = true;
          this.sportPageShow = false;
          this.lotteryPageShow = false;
          this.fishPageShow = false;
          this.electGameShow = false;
          this.gameTypeValue = 5;
          this.depotChange(5);
          break;
        case "fourth": // 体育 - change
          let arr1 = [].concat(allElectSport);
          // arr1.splice(1,0,rateType)
          this.columnArr = arr1;
          console.log(this.columnArr);
          this.mainPageShow = false;
          this.casioPageShow = false;
          this.electronPageShow = false;
          this.sportPageShow = true;
          this.lotteryPageShow = false;
          this.fishPageShow = false;
          this.electGameShow = false;
          this.gameTypeValue = 1;
          this.depotChange(1);
          break;
        case "fifth": // 彩票
          let lotteryList = [].concat(basicColumn);
          // lotteryList.splice(0, 0, odds);
          lotteryList.splice(2, 0, ...betTypeAndResultOpen);
          this.columnArr = lotteryList;
          this.mainPageShow = false;
          this.casioPageShow = false;
          this.electronPageShow = false;
          this.sportPageShow = false;
          this.lotteryPageShow = true;
          this.fishPageShow = false;
          this.electGameShow = false;
          this.tipPageShow = false;
          this.gameTypeValue = 12;
          this.depotChange(12);
          break;
        case "six": // 捕鱼 - change
          // let temArr4 = []
          // temArr4 = temArr4.concat(basicColumn) // , {label: '彩池类型', prop: 'id2'}
          // temArr4.splice(6, 0, {label: '累积投注', prop: 'jackpotBet',align:'right'}, {label: '累积派彩', prop: 'jackpotPayout',align:'right'})
          this.columnArr = basicColumn;
          this.mainPageShow = false;
          this.casioPageShow = false;
          this.electronPageShow = false;
          this.sportPageShow = false;
          this.lotteryPageShow = false;
          this.fishPageShow = true;
          this.electGameShow = false;
          this.tipPageShow = false;
          this.gameTypeValue = 8;
          this.depotChange(8);
          break;
        case "seven": // 棋牌 - change
          this.columnArr = basicColumn;
          this.mainPageShow = false;
          this.casioPageShow = false;
          this.electronPageShow = false;
          this.sportPageShow = false;
          this.lotteryPageShow = false;
          this.fishPageShow = false;
          this.electGameShow = false;
          this.tipPageShow = false;
          this.gameTypeValue = 6;
          this.depotChange(6);
          break;
        case "eight": // 电竞 - change
          let arr2 = [].concat(allElectSport);
          // arr2.splice(1,0,rateType)
          this.columnArr = arr2;
          console.log(this.columnArr);
          this.mainPageShow = false;
          this.casioPageShow = false;
          this.electronPageShow = false;
          this.sportPageShow = false;
          this.lotteryPageShow = false;
          this.fishPageShow = false;
          this.tipPageShow = false;
          this.electGameShow = true;
          this.gameTypeValue = 9;
          this.depotChange(9);
          break;
        case "night": // 小费 -
          this.columnArr = basicColumn.slice(1);
          this.mainPageShow = false;
          this.casioPageShow = false;
          this.electronPageShow = false;
          this.sportPageShow = false;
          this.lotteryPageShow = false;
          this.fishPageShow = false;
          this.electGameShow = false;
          this.tipPageShow = true;
          // this.gameTypeValue = 9;
          // this.depotChange(9);
          this.getPlatform();
          break;
        case "ten": // 斗鸡 - change
          let temArr10 = [].concat(basicColumn);
          // temArr10.splice(0, 0, odds);
          temArr10.splice(2, 0, ...betTypeAndResultOpen);
          this.columnArr = temArr1;
          this.mainPageShow = false;
          this.casioPageShow = true;
          this.electronPageShow = false;
          this.sportPageShow = false;
          this.lotteryPageShow = false;
          this.fishPageShow = false;
          this.electGameShow = false;
          this.gameTypeValue = 49;
          this.depotChange(49);
          break;
      }
      this.getData();
    },
    setTimeToday() {
      this.startTime = systemConfig.getToday() + " " + "00:00:00";
      this.endTime = systemConfig.getToday() + " " + "23:59:59";
    },
    search() {
      if (this.startTime && this.endTime) {
        if (
          new Date(this.startTime).getTime() > new Date(this.endTime).getTime()
        ) {
          this.$message({
            type: "warning",
            message: this.$t("投注起始时间不能大于结束时间"),
          });
          return;
        }
      }
      if (this.payOutStartTime && this.payOutEndTime) {
        if (
          new Date(this.payOutStartTime).getTime() >
          new Date(this.payOutEndTime).getTime()
        ) {
          this.$message({
            type: "warning",
            message: this.$t("派彩起始时间不能大于结束时间"),
          });
          return;
        }
      }
      const arr = [
        "startTime",
        "endTime",
        "payOutEndTime",
        "payOutEndTime",
        "gameStartTime",
        "gameEndTime",
      ];
      arr.map((item) => {
        this[item] = this[item] ? this[item] : "";
      });

      //点击查询按钮
      this.listReq.pageNo = 1;
      //查询数据
      this.getData();
    },
    reset(init) {
      this.memberName = "";
      this.topAgyAccountValue = [];
      this.agyAccountValue = [];
      this.agyAccountOptions = [];
      this.groupValue = "";
      this.betNo = "";
      this.gamePlatformValue = "";
      this.gameTypeValue = "";
      this.gameTypeOptions = [];
      this.terminalValue = "";
      if (!init) {
        this.startTime = "";
        this.endTime = "";
        this.defaultTypeP = "";
        this.$refs.searchTime.defaultType = "";
      }
      this.payOutStartTime = "";
      this.payOutEndTime = "";
      this.statusValue = "";
      this.gameName = "";
      this.gameValue = "";
      this.gtBet = "";
      this.ltBet = "";
      this.gtValidBet = "";
      this.ltValidBet = "";
      this.gtReward = "";
      this.ltReward = "";
      this.gtJpBet = "";
      this.ltJpBet = "";
      this.gtJpReward = "";
      this.ltJpReward = "";
      this.serialId = "";
      this.tableNo = "";
      this.supLoginName = "";
      this.isTip = "";
      this.allTotal = {};
      this.getChildAgent();
      /* //下拉刷新还原
        this.tableData={}
        this.oldTableList=[];
        this.listReq.pageSize = 20
        this.enterNum=0; */
    },
    // 更多查询toggle
    more() {
      if (this.searchClass == "searchNewTwo") {
        this.searchClass = "searchNew";
        this.extendTitle = this.$t("更多");
        this.showExtend = false;
      } else {
        this.searchClass = "searchNewTwo";
        this.extendTitle = this.$t("收起");
        this.showExtend = true;
      }
    },
    handleSizeChange(val) {
      this.listReq.pageNo = 1;
      this.listReq.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.listReq.pageNo = val;
      this.getData();
    },
    indexMethod(index) {
      let itemIndex =
        index + 1 + (this.listReq.pageNo - 1) * this.listReq.pageSize;
      let min = Math.min(
        this.total,
        this.listReq.pageNo * this.listReq.pageSize
      );
      if ([this.$t("小计"), this.$t("总计")].includes(this.tableData.list[index].gameName)) {
        return this.tableData.list[index].gameName === this.$t("小计") ? this.$t("小计") : this.$t("总计");
      }
      if (itemIndex <= min) {
        return itemIndex;
      } else {
        return "";
      }
    },
    getAgyAccount(id) {
      if (id.length > 0) {
        this.agyAccountOptions = [];
        this.agyAccountValue = [];
        return Promise.all(
          id.map((i) =>
            this.$axios.get(systemConfig.urls.getAgyAccountIncludeDisable, {
              params: {
                parentId: i,
              },
            })
          )
        ).then((res) => {
          this.agyAccountOptions = res.reduce((prev, curr) => {
            prev.push(...curr.data.accounts);
            return prev;
          }, []);
        });
      } else {
        this.agyAccountOptions = this.trueAgyAccountOptions;
        return this.$axios
          .get(systemConfig.urls.getAgyAccountIncludeDisable + "?parentId=")
          .then((resp) => {
            this.topAgyAccountOptions = resp.data.accounts;
          });
      }
    },
    getMemberOptions() {
      this.$axios.get(systemConfig.urls.mbrGrouplist).then((resp) => {
        this.groupOptions = resp.data.page;
      });
    },
    getPlatform(id) {
      const key =
        (id && this.gamePlatformOptions.find((item) => item.id === id).key) ||
        "";
      if (!(id && !key)) {
        return this.$axios
          .get(systemConfig.urls.getPlatform + "?codetype=" + key)
          .then((resp) => {
            if (!key) {
              // 后台的返回值是[null]   - -
              if (resp.data.page[0]) {
                /* this.gamePlatformValue=2; */
                this.gamePlatformOptions = resp.data.page;
              } else {
                this.gamePlatformOptions = [];
              }
            } else {
              if (resp.data.page[0]) {
                this.gameTypeOptions = resp.data.page;
              } else {
                this.gameTypeOptions = [];
              }
              if (
                !this.gameTypeOptions.find(
                  (item) => item.key === this.gameTypeValue
                )
              ) {
                // 如果切换平台 平台下面的分类不包含已选择的分类 则置为空
                this.gameTypeValue = "";
              }
              console.log("qwe", this.gameTypeOptions);
            }
          });
      }
    },
    handleChangTip(val) {
      if (val === 1) {
        this.tipSelect = true;
        this.gameTypeValue = "";
      } else {
        this.tipSelect = false;
      }
    },
    depotChange(value) {
      this.$axios
        .get(systemConfig.urls.getPlatformByDepot + "?catId=" + value)
        .then((resp) => {
          this.gamePlatformOptions = [];
          resp.data.tDepots.map((item) => {
            this.gamePlatformOptions.push({
              id: item.depotId,
              value: item.depotName,
            });
          });
        });
    },
    getGameValue(type) {
      this.$axios
        .get(systemConfig.urls.getSubCat + "?catId=" + type)
        .then((resp) => {
          this.gameOptions = resp.data.subCats;
        });
    },
    timeFilter(row, column) {
      var date = row[column.property];
      if (date == null || date === "") {
        return "";
      }
      return systemConfig.transferTimeByType(date, this.timeType);
    },
    getData() {
      this.getCurrentRecodeTime();
      if (this.$router.history.current.query.memberName && this.isym) {
        this.memberName = this.$router.history.current.query.memberName;
        this.isym = false;
      }
      let params = {
        pageNo: this.listReq.pageNo,
        pageSize: this.listReq.pageSize,
        betid: this.betNo,
      };
      // 时间不能传空
      if (
        (!this.startTime || !this.endTime) &&
        (!this.payOutStartTime || !this.payOutEndTime)
      ) {
        this.$message({
          type: "warning",
          message: this.$t("请选择投注或派彩时间"),
        });
        return;
      }
      params = {
        ...params,
        betStrTime:
          this.timeType === "md"
            ? systemConfig.transferTimeByType(this.startTime, "mdToBj")
            : this.startTime,
        betEndTime:
          this.timeType === "md"
            ? systemConfig.transferTimeByType(this.endTime, "mdToBj")
            : this.endTime,
        payOutStrTime:
          this.timeType === "md"
            ? systemConfig.transferTimeByType(this.payOutStartTime, "mdToBj")
            : this.payOutStartTime,
        payOutEndTime:
          this.timeType === "md"
            ? systemConfig.transferTimeByType(this.payOutEndTime, "mdToBj")
            : this.payOutEndTime,
        gameStartTime:
          this.timeType === "md"
            ? systemConfig.transferTimeByType(this.gameStartTime, "mdToBj")
            : this.gameStartTime,
        gameEndTime:
          this.timeType === "md"
            ? systemConfig.transferTimeByType(this.gameEndTime, "mdToBj")
            : this.gameEndTime,
        status: this.statusValue,
        loginName: this.memberName,
        groupid: this.groupValue,
        platform: this.gamePlatformValue,
        gametype: this.gameTypeValue,
        tagencyIdList: this.topAgyAccountValue.join(","),
        cagencyIdList: this.agyAccountValue.join(","),
        supLoginName: this.supLoginName,
        isTip: this.activeName === "night" ? 1 : this.isTip,
      };
      this.isSearching = true;
      this.$axios
        .get(systemConfig.urls.analysisBetDetailsFinalBetDetailsAll, { params })
        .then((resp) => {
          this.isSearching = false;
          this.isLoading = false;
          let data = resp.data.page;
          this.getNetworkLoadAndDataSolveTime(resp);
          // 自己添加的友好展示    先用着吧
          for (var i = 0; i < data.length; i++) {
            data[i].downtime = systemConfig.transferTimeByType(
              data[i].downtime,
              this.timeType
            );
            data[i].bettime = systemConfig.transferTimeByType(
              data[i].bettime,
              this.timeType
            );
            data[i].rewardtime = systemConfig.transferTimeByType(
              data[i].rewardtime,
              this.timeType
            );
          }
          data.list = data.list.map((i) => ({
            ...i,
            openResultDetail: i.openResultDetail
            ? JSON.parse(i.openResultDetail)
              : null,
          }));
          this.tableData = data;
          this.total = resp.data.page.pageTotalCount;
          this.totalCount = resp.data.page.totalCount;
          this.allTotal = resp.data.total;
        });
    },
    updateTwoNumber(row, column, cellValue) {
      if (cellValue === 0) {
        return 0;
      }
      if (twoNumberArr.indexOf(column.property) > -1) {
        return systemConfig.saveTwoNumber(cellValue);
      } else {
        return cellValue;
      }
    },
    handleExport() {
      let params;
      if (this.betNo) {
        // 根据注单号查询时 不传其他查询条件
        params = {
          ...params,
          betid: this.betNo,
        };
      } else {
        // 时间不能传空
        if (
          (!this.startTime || !this.endTime) &&
          (!this.payOutStartTime || !this.payOutEndTime)
        ) {
          this.$message({
            type: "warning",
            message: this.$t("请选择投注或派彩时间"),
          });
          return;
        }
        params = {
          ...params,
          betStrTime:
            this.timeType === "md"
              ? systemConfig.transferTimeByType(this.startTime, "mdToBj")
              : this.startTime,
          betEndTime:
            this.timeType === "md"
              ? systemConfig.transferTimeByType(this.endTime, "mdToBj")
              : this.endTime,
          payOutStrTime:
            this.timeType === "md"
              ? systemConfig.transferTimeByType(this.payOutStartTime, "mdToBj")
              : this.payOutStartTime,
          payOutEndTime:
            this.timeType === "md"
              ? systemConfig.transferTimeByType(this.payOutEndTime, "mdToBj")
              : this.payOutEndTime,
          status: this.statusValue,
          loginName: this.memberName,
          groupid: this.groupValue,
          platform: this.gamePlatformValue,
          gametype: this.gameTypeValue,
          tagencyIdList: this.topAgyAccountValue.join(","),
          cagencyIdList: this.agyAccountValue.join(","),
          pageNo: this.listReq.pageNo,
          pageSize: this.listReq.pageSize,
          supLoginName: this.supLoginName,
        };
      }
      this.isNowDowning = false;
      this.$axios
        .get(systemConfig.urls.betRecodeExcel, { params })
        .then((res) => {
          let isDownBool = res.data.data || res.data.code == 500;
          if (isDownBool) {
            this.$message({
              type: "warning",
              message: res.data.msg,
            });
            this.isNowDowning = true;
          } else {
            this.recodeTime = systemConfig.getNowTime();
            this.checkExportFile(params.gametype);
          }
        })
        .catch((err) => {
          if (err.data.code == 500) {
            this.isNowDowning = true;
          }
        });
    },
    checkExportFile(gametype) {
      // 查看导出文件是否可下载
      this.$axios
        .get(systemConfig.urls.checkBetRecodeIsDown, {
          params: {
            gametype,
          },
        })
        .then((res) => {
          let obj = res.data.data || {};
          let fileName = obj.fileName,
            downloadFileName = obj.downloadFileName;
          if (fileName) {
            const { baseURL } = res.config;
            // 下载文件
            let SToken = localStorage.getItem("SToken");
            window.open(
              baseURL +
              `/${systemConfig.urls.downloadMbrExcel}?fileName=${fileName}&downloadFileName=${downloadFileName}&SToken=${SToken}&language=${localStorage.getItem('lang')}`
            );
            this.isNowDowning = true;
          } else {
            let nowTime = systemConfig.getNowTime(); // 10 * 60 * 1000
            if (nowTime - this.recodeTime <= 600000) {
              //10分钟的时间间隔
              setTimeout(() => this.checkExportFile(gametype), 5000);
            } else {
              this.isNowDowning = true;
              this.$message({
                type: "warning",
                message: this.$t("导出时间超过10分钟"),
              });
            }
          }
        });
    },
    scrollToTop() {
      this.$scrToBottom.scrollToTop();
    },
    judeg({ gameCategory, platform, betType }) {
      let passArry = ["EG", "AGIN", "SUN", "BBIN", "AB", "BG"]; //真人
      let sportArry = ["AGIN", "IBC", "XJ"]; //体育
      if (
        (gameCategory == "Live" && passArry.includes(platform)) ||
        (gameCategory == "Sport" && sportArry.includes(platform))
      ) {
        return true;
      } else {
        return false;
      }
    },
    isTranslate (row, betText) {
      const { type } = row.openResultModel
      return type === 'tc_cp_detail' ? betText : this.transTC(betText)
    },
    transTC(text) {
      let str = lottTranslator.translateBallContentText(1860, text);
      // return /[大|小|单|双]/.test(str) ? str : text;
      return [this.$t('大'),this.$t('小'),this.$t('单'),this.$t('双')].includes(str) ? str : text;
    },
    transTC2(text) {
      let str = lottTranslator.translatePlayName(text);
      return !/undefined/.test(str) ? str : "";
    },
    showChuan(row) {
      this.chuanRow = Object.assign({}, row);
      this.showChuanPop = true;
    },
    handleResultScore(row) {
      if (["Sport", "Esport"].includes(row.gameCategory)) {
        return row.resultScore || "-";
      }
      if (["Live", "Lottery", "Ball"].includes(row.gameCategory)) {
        return row.resultOpen || "-";
      }
      return row.result || "-";
    },
    getResultScore(row, index) {
      const scoreStr = this.handleResultScore(row);
      if (scoreStr && scoreStr !== "-") {
        return scoreStr.split(",")[index] || '-';
      }
      return scoreStr || '-';
    },
    getHalfResultScore(halfResultScoreStr, index) {
      return halfResultScoreStr
        ? halfResultScoreStr.split(",")[index] || "-"
        : halfResultScoreStr || '-';
    },
  },
};
</script>
<style lang="scss">
.bet-record-pagination {
  display: flex;
  margin-top: 20px;
  align-items: center;
  justify-content: flex-end;
}

.result-dragon {
  .right {
    display: flex;
    flex-direction: column;
  }
}
.bet-detail-sprites {
  display: inline-block;
  vertical-align: top;
  background: url("../../assets/img/bet-detail-sprites.png") no-repeat;
  &.i-puke {
    width: 76px;
    height: 107px;
    transform: scale(0.5);
  }
  &.i-majiang {
    width: 90px;
    height: 115px;
    transform: scale(0.3);
  }
  &.i-touzi {
    width: 90px;
    height: 90px;
    transform: scale(0.5);
  }
}
.betResult-betType {
  word-break: break-all;
  line-height: 26px;
}
.search-div-item {
  .radio {
    width: 182px;
    margin-top: 32px;
  }
}

.special-fgf {
  width: 5px !important;
  line-height: 75px;
}

.ml20 {
  margin-left: 20px;
}

.bet-detail {
  border: 1px solid rgb(211, 211, 211);
  width: 95%;
  margin: 0 auto;
  line-height: 36px;
  text-align: center;
  .row1 {
    display: flex;
    text-align: center;
    .left {
      font-size: 14px;
      color: #666666;
      border-bottom: 1px solid rgb(211, 211, 211);
      border-right: 1px solid rgb(211, 211, 211);
      flex: 1;
    }
    .right {
      border-bottom: 1px solid rgb(211, 211, 211);
      flex: 7;
    }
  }
  .row4 {
    display: flex;
    text-align: center;
    .left {
      font-size: 14px;
      color: #666666;
      border-bottom: 1px solid rgb(211, 211, 211);
      border-right: 1px solid rgb(211, 211, 211);
      flex: 2;
      position: relative;
      span {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .left1 {
      font-size: 14px;
      color: #666666;
      border-right: 1px solid rgb(211, 211, 211);
      flex: 2;
    }
    .right {
      border-bottom: 1px solid rgb(211, 211, 211);
      flex: 6;
    }
    .right1 {
      flex: 6;
    }
  }
  .row2 {
    display: flex;
    text-align: center;
    .left {
      font-size: 14px;
      color: #333333;
      flex: 2;
      display: flex;
      .item1 {
        font-size: 14px;
        color: #666666;
        flex: 1;
        border-bottom: 1px solid rgb(211, 211, 211);
        border-right: 1px solid rgb(211, 211, 211);
      }
    }
    .item {
      font-size: 14px;
      color: #666666;
      flex: 1;
      border-bottom: 1px solid rgb(211, 211, 211);
      border-right: 1px solid rgb(211, 211, 211);
      &:last-child {
        border-right: none;
      }
    }
  }
  .row-eg {
    display: flex;
    text-align: center;
    .item {
      font-size: 14px;
      color: #666666;
      flex: 1;
      border-bottom: 1px solid rgb(211, 211, 211);
      border-right: 1px solid rgb(211, 211, 211);
      &:last-child {
        border-right: none;
      }
    }
  }
  .row3 {
    display: flex;
    text-align: center;
    .left {
      font-size: 14px;
      color: #333333;
      flex: 2;
      border-right: 1px solid rgb(211, 211, 211);
    }
    .item {
      font-size: 14px;
      color: #666666;
      flex: 1;
      border-right: 1px solid rgb(211, 211, 211);
      &:last-child {
        border-right: none;
      }
    }
  }
  // 百家乐 龙虎斗
  .result-bjl {
    display: flex;
    .left1 {
      font-size: 14px;
      color: #666666;
      border-bottom: 1px solid rgb(211, 211, 211);
      border-right: 1px solid rgb(211, 211, 211);
      flex: 1;
    }
    .right1 {
      flex: 7;
      .item {
        display: flex;
        .left {
          border-bottom: 1px solid rgb(211, 211, 211);
          border-right: 1px solid rgb(211, 211, 211);
          flex: 1;
        }
        .right {
          border-bottom: 1px solid rgb(211, 211, 211);
          flex: 1;
        }
      }
    }
  }
  // 三公
  .result-sangong {
    display: flex;
    text-align: center;
    .left {
      flex: 1;
      border-right: 1px solid rgb(211, 211, 211);
      border-bottom: 1px solid rgb(211, 211, 211);
      line-height: 12;
      text-align: center;
    }
    .right {
      flex: 7;
      .right1 {
        display: flex;
        height: 25%;
        .item {
          flex: 1;
          border-bottom: 1px solid rgb(211, 211, 211);
          border-right: 1px solid rgb(211, 211, 211);
          &:last-child {
            border-right: none;
          }
        }
      }
      .right2 {
        display: flex;
        .item {
          flex: 1;
          border-bottom: 1px solid rgb(211, 211, 211);
          border-right: 1px solid rgb(211, 211, 211);
          &:last-child {
            border-right: none;
          }
        }
      }
      .wrapper {
        display: flex;
        height: 100%;
        .right3 {
          display: flex;
          flex-direction: column;
          flex: 1;
          border-right: 1px solid rgb(211, 211, 211);
          .label {
            border-bottom: 1px solid rgb(211, 211, 211);
          }
          .value {
            flex: 6;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            border-bottom: 1px solid rgb(211, 211, 211);
            span {
              font-size: 100px !important;
            }
          }
          &:last-child {
            border-right: none;
          }
        }
      }
    }
  }
  // 牌九 骰包
  .result-paijiu {
    display: flex;
    .left {
      flex: 1;
      line-height: 9;
      border-bottom: 1px solid rgb(211, 211, 211);
      border-right: 1px solid rgb(211, 211, 211);
    }
    .right {
      flex: 7;
      .right1 {
        display: flex;
        .item {
          flex: 1;
          border-bottom: 1px solid rgb(211, 211, 211);
          border-right: 1px solid rgb(211, 211, 211);
          &:last-child {
            border-right: none;
          }
        }
      }
    }
  }
  .result-saibao {
    .left {
      line-height: 5;
    }
  }
  .result-bjl-sb {
    .left {
      line-height: 19;
    }
    .right2:nth-child(2) {
      .item {
        line-height: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 100px !important;
        span {
          font-size: 100px !important;
        }
      }
    }
  }
  .result-saibai-sb {
    .right {
      display: flex;
      flex-direction: column;
    }
    .right1 {
      flex: 1;
      &.touzi {
        .item {
          display: flex;
          justify-content: center;
          align-items: center;
          color: #000;
          font-size: 35px !important;
        }
      }
    }
  }
  .result-mj-sb {
    .right {
      display: flex;
      flex-wrap: wrap;
      .item {
        display: flex;
        flex-direction: column;
        flex: 1;
        border-right: 1px solid lightgray;
        border-bottom: 1px solid lightgray;
        .label {
          flex: 1;
          border-bottom: 1px solid lightgray;
        }
        .value {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 6;
          font-size: 30px !important;
        }
        &:last-child {
          border-right: 0;
        }
      }
    }
  }
  .result-sangong-sb {
    .left {
      line-height: 35;
      &.isBull {
        line-height: 55;
      }
    }
    .right {
      .item {
        .value {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          span {
            font-size: 100px !important;
          }
        }
      }
    }
  }
  // 轮盘
  .result-rou {
    display: flex;
    text-align: center;
    .left {
      flex: 1;
      border-bottom: 1px solid rgb(211, 211, 211);
      border-right: 1px solid rgb(211, 211, 211);
    }
    .right {
      flex: 7;
      border-bottom: 1px solid rgb(211, 211, 211);
    }
  }
  // 德州扑克
  .result-dezhou {
    display: flex;
    .left {
      flex: 1;
      border-bottom: 1px solid rgb(211, 211, 211);
      border-right: 1px solid rgb(211, 211, 211);
      line-height: 5;
    }
    .right {
      flex: 7;
      .right1 {
        display: flex;
        .item {
          flex: 1;
          height: 30%;
          border-bottom: 1px solid rgb(211, 211, 211);
          border-right: 1px solid rgb(211, 211, 211);
          &:last-child {
            border-right: none;
          }
        }
        .item2 {
          flex: 4;
          height: 40%;
          border-bottom: 1px solid rgb(211, 211, 211);
          border-right: 1px solid rgb(211, 211, 211);
          &:last-child {
            border-right: none;
          }
        }
      }
    }
  }
  .result-bb21 {
    display: flex;
    text-align: center;
    .left {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid rgb(211, 211, 211);
      border-right: 1px solid rgb(211, 211, 211);
    }
    .right {
      flex: 7;
      border-bottom: 1px solid rgb(211, 211, 211);
    }
    .right1 {
      .item {
        border-bottom: 1px solid rgb(211, 211, 211);
        &:last-child {
          border-bottom: 0;
        }
      }
    }
  }
  .wenZhou_paiGow {
    display: flex;
    text-align: center;
    .left {
      flex: 1;
      border-bottom: 1px solid rgb(211, 211, 211);
      border-right: 1px solid rgb(211, 211, 211);
    }
    .right {
      flex: 7;
      display: flex;
      flex-wrap: wrap;
      .right2 {
        flex: 1;
        border-bottom: 1px solid rgb(211, 211, 211);
        border-right: 1px solid rgb(211, 211, 211);
        &:nth-child(4),
        &:nth-child(5) {
          border-right: 0;
        }
        .label {
          min-width: 165px;
          border-bottom: 1px solid rgb(211, 211, 211);
        }
        .value {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100px;
          span {
            font-size: 80px !important;
          }
        }
      }
      .result {
        width: 100%;
        text-align: center;
        border-bottom: 1px solid rgb(211, 211, 211);
      }
    }
  }
  .result-ag21 {
    display: flex;
    text-align: center;
    .left {
      flex: 1;
      border-bottom: 1px solid rgb(211, 211, 211);
      border-right: 1px solid rgb(211, 211, 211);
    }
    .right {
      flex: 7;
      display: flex;
      flex-wrap: wrap;
      .right1 {
        display: flex;
        .item {
          flex: 1;
          border-bottom: 1px solid rgb(211, 211, 211);
          border-right: 1px solid rgb(211, 211, 211);
          &:last-child {
            border-right: none;
          }
        }
      }
      .right2 {
        flex: 1;
        border-bottom: 1px solid rgb(211, 211, 211);
        border-right: 1px solid rgb(211, 211, 211);
        &:nth-child(2n) {
          border-right: 0;
        }
        .label {
          min-width: 255px;
          border-bottom: 1px solid rgb(211, 211, 211);
        }
        .value {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100px;
          span {
            font-size: 80px !important;
          }
        }
      }
    }
  }
}
.mb10 {
  margin-bottom: 10px;
}
.tableToTop {
  position: absolute;
  right: 110px;
  top: 10px;
  font-size: 13px;
  cursor: pointer;
}
.betType {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.payoutRed {
  color: #ff0000;
}
.mr0 {
  margin-right: 0 !important;
}
.lineClamp2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  white-space: normal;
}
.w50 {
  width: 100px;
}
.center80 {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.gray.is-disabled {
  background: #999 !important;
  border-color: #999 !important;
}
</style>
