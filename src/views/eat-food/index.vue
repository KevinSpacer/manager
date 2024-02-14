<template>
  <div class="eat-food-box">
    <!-- 右侧购物车菜单 -->
    <div class="right-container ml-scrollbar">
      <!-- 购物车 -->
      <div class="car-menu-box">
        <!-- 人数、座位、服务员 -->
        <!-- 堂食 -->
        <div class="top-show-info" v-if="routeParams.type == 'EAT_IN'">
          <!-- @click.stop="openToolDialog('updatePeopleQuantity')" -->
          <div class="peopel btn oneLineOver" @click.stop="openPeopelDialog('peopel')">
            <span>{{ $LANG_TEXT("人数") }}：</span>
            <span>{{ routeParams.peopleQuantity }}</span>
          </div>
          <div class="intercept btn oneLineOver" @click.stop="openSeatDialog">
            <span>{{ $LANG_TEXT("座位") }}：</span>
            <span>{{ routeParams.location }}</span>
          </div>
          <div class="waiter btn oneLineOver" @click="openTypeChangeDialog">
            <span>{{ $LANG_TEXT("类型") }}：</span>
            <span>{{ routeParams.type == 'EAT_IN' ? "堂吃" : "" }}</span>
          </div>
        </div>
        <!-- 客户、终端号、服务员 -->
        <!-- 其他 -->
        <div class="top-show-info" v-else>
          <div class="peopel btn oneLineOver" @click.stop="openCustomerDialog">
            <span>{{ $LANG_TEXT("客户") }}：</span>
            <span>{{ routeParams.userName }}</span>
          </div>
          <div class="intercept btn oneLineOver" @click.stop="openCustomerDialog">
            <span>{{ $LANG_TEXT("号码") }}：</span>
            <span>{{ routeParams.contactWay }}</span>
          </div>
          <div class="waiter btn oneLineOver" @click="openTypeChangeDialog">
            <span>{{ $LANG_TEXT("类型") }}：</span>
            <span>{{ routeParams.type == 'TAKE_FOOD' ? "等取" : "外送" }}</span>
          </div>
          <div class="waiter btn oneLineOver" @click="openCustomerDialog">
            <span>{{ $LANG_TEXT("地址") }}：</span>
            <span>{{ routeParams.address }}</span>
          </div>
        </div>

        <!-- 购物车内容 -->
        <div class="car-container">
          <!-- 标题头 -->
          <div class="table-theader">
            <p>{{ $LANG_TEXT("商品") }}</p>
            <p>{{ $LANG_TEXT("状态") }}</p>
            <p>{{ $LANG_TEXT("数量") }}</p>
            <p class="oneLineOver">{{ $LANG_TEXT("金额") }}</p>
          </div>

          <!-- 内容 -->
          <div class="content">
            <div class="table-list ml-scrollbar">
              <div v-if="addedToCart.length">
                <!-- 菜品 -->
                <div class="list-item" :class="{ active: chooseCarGoodsIndex === index }"
                  v-for="(item, index) in addedToCart" :key="'car-item' + index">
                  <!-- 菜品、套餐 -->
                  <div class="first-item">
                    <div class="product-name" @click.stop="changeCarListItem(index)">
                      <second-language class="oneLineOver"
                        :firstText="`${item.name}(${item.dishesSpecificationList[0].dishesSpecificationAttributeList[0].name})`"
                        :secondText="item.nameLanguage || item.name"></second-language>

                    </div>
                    <!-- {{item}} -->
                    <div class="product-status" @click.stop="changeCarListItem(index)">
                      {{ $LANG_TEXT(item.orderType ? "已下单" : "") }}
                    </div>
                    <div class="product-num">
                      <!-- 操作数量 可操作状态（支付状态）&&不是 已下单 && 权限 -->
                      <!-- {{isActionOrder}}
                      {{item.orderType}}
                      {{proxy.$isUseAuth('删除菜品')}} -->
                      <number-change v-if="isActionOrder && !item.orderType" iconSize="14px"
                        @changeCount="carListChangeCount($event, item, index)" :addDisabled="item.addDisabled"
                        v-model="item.goodsQuantity"></number-change>
                      <span v-else>{{ item.goodsQuantity }}</span>
                    </div>
                    <div class="product-price" @click.stop="changeCarListItem(index)">
                      ${{ (item.originPrice * item.goodsQuantity || 0).toFixed(2) }}

                      <!-- 折扣 -->
                      <span>
                        <i class="iconfont icon-discount" v-if="item.isDiscount == 'YES'"></i>
                        <!-- 百分比 -->
                        <span v-if="item.dishesDiscountType == 'PERCENT' &&
                          Number(item.dishesDiscount) &&
                          item.dishesDiscount != 100
                          ">
                          (${{ item.originPrice }})
                        </span>

                        <!-- 定额 -->
                        <span v-if="item.dishesDiscountType == 'QUOTA' &&
                          Number(item.dishesDiscount)
                          ">
                          (${{ item.discountPrice }})
                        </span>
                      </span>
                    </div>
                  </div>

                  <!-- 底部 规格  -->
                  <!-- @handClick="changeCarListItem(index)" -->
                  <list-item :goodsDetail="item" @deleteCondiments="deleteCondiment($event, index)"
                    @changeSpec="changeSpec($event)"></list-item>
                </div>
              </div>

              <!-- 缺省 -->
              <el-empty class="ml-empty" v-else :description="$LANG_TEXT('暂无数据')" />
            </div>

            <!-- 统计明细 -->
            <div class="goods-detailed">
              <!-- <p>
								{{ $LANG_TEXT("显示金额") }}：{{
									$LANG_TEXT(goodsDetailed.showMoneyType)
								}}
							</p> -->
              <p v-if="goodsDetailed.discountType.value">
                {{ $LANG_TEXT("折扣类型") }}：{{
                  $LANG_TEXT(goodsDetailed.discountType.label)
                }}
              </p>
              <p v-if="goodsDetailed.discountType.value">
                {{ $LANG_TEXT("折扣") }}：-{{
                  goodsDetailed.discountType.value
                }}
              </p>
              <p v-if="goodsDetailed.discountMannerText &&
                  goodsDetailed.discountType.value
                  ">
                {{ $LANG_TEXT("折扣方式") }}：{{
                  $LANG_TEXT(goodsDetailed.discountMannerText)
                }}
              </p>
              <!-- 外卖 -->
              <p v-if="routeParams.type == 'TAKE_OUT'">
                {{ $LANG_TEXT("外卖费用") }}：{{
                  goodsDetailed.deliveryFeeValue
                }}
              </p>
              <p>
                <span>{{ $LANG_TEXT("服务费用") }}：{{
                  goodsDetailed.serviceValue
                }}</span>
                <span v-if="goodsDetailed.serviceChargeTypeText">（{{
                  $LANG_TEXT(goodsDetailed.serviceChargeTypeText)
                }}）</span>
              </p>
              <p v-if="toolForm.tip.payAmount">
                {{ $LANG_TEXT("小费") }}：{{ goodsDetailed.tipText }}
              </p>
              <p>
                {{ $LANG_TEXT("税率") }}：{{
                  $LANG_TEXT(goodsDetailed.taxRateValue)
                }}
              </p>
              <p>
                {{ $LANG_TEXT("是否免单") }}：{{
                  $LANG_TEXT(goodsDetailed.isFreeOrder)
                }}
              </p>
              <p class="total-price">
                {{ $LANG_TEXT("订单金额（原价）") }}：
                <span> ${{ getTotalOrderAmount.originPrice }} </span>
              </p>
              <p class="total-price">
                {{ $LANG_TEXT("实付金额") }}：
                <span> ${{ paidAmount }} </span>
              </p>

              <p>
                {{ $LANG_TEXT("抹零") }}：{{
                  $LANG_TEXT(goodsDetailed.maLingType)
                }}
              </p>
              <p v-if="goodsDetailed.maLingType != $LANG_TEXT(`不抹`)">
                {{ $LANG_TEXT("抹零金额") }}：${{ notCountPrice }}
              </p>
              <p>
                {{ $LANG_TEXT("上菜方式") }}：{{
                  $LANG_TEXT(routeParams.serveDishesWay)
                }}
              </p>
              <p>{{ $LANG_TEXT("备注") }}：{{ $LANG_TEXT(toolForm.remark) }}</p>
            </div>
            <!-- <div class="log1 down-log">
							<p>{{ $LANG_TEXT("小计") }}：$12</p>
							<p>{{ $LANG_TEXT("服务费") }}：$12</p>
							<p>{{ $LANG_TEXT("总额") }}：$12</p>
						</div>
						<div class="log2 down-log">
							<p>{{ $LANG_TEXT("税金") }}：$12</p>
							<p>{{ $LANG_TEXT("折扣") }}：$12</p>
							<p>
								{{ $LANG_TEXT("上菜方式") }}：{{ routeParams.serveDishesWay }}
							</p>
						</div>
						<div class="log3 down-log">
							<span>{{ $LANG_TEXT("备注") }}：</span>
							<span>{{ routeParams.remark }}</span>
						</div> -->
          </div>
        </div>
      </div>

      <!-- 多功能按钮区域 -->
      <!-- <div class="tool-btn-area" v-if="orderDetail || !routeParams.orderId"> -->
      <div class="tool-btn-area" v-if="isActionOrder">
        <!-- 分区 -->
        <div class="top-line">
          <!-- 其他 -->
          <el-button type="info" @click.stop="openOtherDialog">
            <el-icon>
              <More />
            </el-icon>
            {{ $LANG_TEXT("其他") }}
          </el-button>
          <!-- 打印送厨 -->
          <el-button type="primary" @click="printJump" :disabled="!routeParams.orderId ||
            eatFoodModule.chooseOrderType != 'orderCarData'
            " v-if="proxy.$isUseAuth('送厨')">
            <el-icon>
              <Printer />
            </el-icon>
            {{ $LANG_TEXT("重新打印") }}
          </el-button>
          <el-button type="success" @click.stop="goBack">
            {{ $LANG_TEXT("全部订单") }}
          </el-button>
          <!-- <el-button
            @click.stop="setCondiment"
            :disabled="
              chooseCarGoodsIndex === '' || chooseCartData.orderType || isInPay
            "
          >
            {{ $LANG_TEXT("调味品") }}
          </el-button> -->

          <!-- <div @click.stop>
            <el-dropdown v-if="proxy.$isUseAuth('上菜方式')" trigger="click">
              <el-button
                :disabled="
                  isInPay ||
                  (!routeParams.orderId &&
                    isEmpty.includes(chooseCarGoodsIndex))
                "
              >
                {{ $LANG_TEXT("上菜方式") }}
              </el-button>
              <template #dropdown>
                <el-dropdown-menu> -->
          <!-- <el-dropdown-item 
                    v-for="item in serveDishesWayOpts"
                    :key="item"
                    @click.stop="editDishesWay(item)"
                    :disabled="routeParams.serveDishesWay == item"
                    >{{ $LANG_TEXT(item || "无") }}</el-dropdown-item> -->
          <!-- <el-dropdown-item>5 min</el-dropdown-item>
                    <el-dropdown-item>10 min</el-dropdown-item>
                    <el-dropdown-item>15 min</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div> -->

          <el-button :disabled="isInPay ||
            (!routeParams.orderId && isEmpty.includes(chooseCarGoodsIndex))
            " v-if="proxy.$isUseAuth('备注')" @click.stop="openToolDialog('remark')">
            <el-icon>
              <BellFilled />
            </el-icon>
            {{ $LANG_TEXT("备注") }}
          </el-button>
        </div>

        <div class="bottom">
          <div class="left">
            <!-- <el-button
              v-if="proxy.$isUseAuth('税率')"
              type="warning"
              :disabled="!routeParams.orderId || isInPay"
              @click.stop="openToolDialog('taxRate')"
            >
              <el-icon><PriceTag /></el-icon>
              {{ $LANG_TEXT("税率") }}
            </el-button> -->
            <!-- <el-button
              type="primary"
              :disabled="!routeParams.orderId || isInPay"
              @click.stop="openToolDialog('freeCharge')"
            >
              {{ $LANG_TEXT("免单") }}
            </el-button> -->

            <!-- <el-button
              v-if="proxy.$isUseAuth('分单')"
              type="primary"
              @click.stop="$navigateTo('/eatFoodSplitOrder', routeParams)"
              :disabled="
                eatFoodModule.chooseOrderType != 'orderCarData' || isInPay
              "
            >
              {{ $LANG_TEXT("菜品分单") }}
            </el-button> -->

            <!-- <el-button
              v-if="proxy.$isUseAuth('合单')"
              type="primary"
              :disabled="!routeParams.orderId || isInPay"
              @click.stop="openToolDialog('consolidated')"
            >
              {{ $LANG_TEXT("合单") }}
            </el-button> -->
            <!-- 折扣 -->
            <el-button type="warning" @click.stop="opendiscountDialog">
              <el-icon>
                <Discount />
              </el-icon>
              {{ $LANG_TEXT("折扣") }}
            </el-button>
            <!-- 暂存订单 -->
            <ml-btn type="primary" @submit="stagingOrder($event, 'storeOrder')" :disabled="!addedToCart.length ||
              isInPay ||
              !orderSubmitData.shoppingGoodsList.length
              ">
              <el-icon>
                <List />
              </el-icon>
              {{ $LANG_TEXT("暂存订单") }}
            </ml-btn>
            <!-- below remove in order to able to open payment box even order placed even zizhen guo 01-25-204 -->
            <!-- :disabled="!routeParams.orderId ||!getTypeStatusBtn('DIRECT_PAY') ||!isOrdered"  -->
            <el-button v-if="proxy.$isUseAuth('付款')" type="info" @click.stop="openToolDialog('payment')">
              <el-icon>
                <WalletFilled />
              </el-icon>
              {{ $LANG_TEXT("付款") }}
            </el-button>
            <ml-btn @click.stop type="danger" class="playOrder" @submit="stagingOrder($event, 'playOrder')" :disabled="!addedToCart.length ||
              !orderSubmitData.shoppingGoodsList.length
              ">
              <el-icon>
                <List />
              </el-icon>
              {{ $LANG_TEXT("下单") }}
            </ml-btn>
            <!-- <el-button
              type="info"
              :disabled="
                !routeParams.orderId ||
                !getTypeStatusBtn('AA_PAY') ||
                routeParams.peopleQuantity == 0 ||
                !isOrdered
              "
              @click.stop="openPeopelDialog('AA')"
              ><el-icon><WalletFilled /></el-icon>
              {{ $LANG_TEXT("AA付款") }}
            </el-button> -->
            <!-- <el-button
              :disabled="
                !routeParams.orderId ||
                !getTypeStatusBtn('SHARE_PAY') ||
                !isOrdered
              "
              type="info"
              @click.stop="openToolDialog('partialPay')"
            >
              <el-icon><WalletFilled /></el-icon>
              {{ $LANG_TEXT("分额付款") }}
            </el-button> -->

            <!-- 禁用条件 -->
            <!--  
              ！！表示对非boolean true 的校正
							未进行暂存、下单
							未选择购物车菜品
							正在支付
						-->
            <!-- <el-button
              v-if="
                proxy.$isUseAuth('删除菜品') ||
                (!isEmpty.includes(chooseCarGoodsIndex) &&
                  !chooseCartData.orderType)
              "
              type="danger"
              :disabled="
                !routeParams.orderId ||
                isEmpty.includes(chooseCarGoodsIndex) ||
                isInPay
              "
              @click="deleteDishes"
            >
              <el-icon><Delete /></el-icon>
              {{ $LANG_TEXT("删除菜品") }}
            </el-button> -->
            <!-- <el-button type="danger" @click.stop="router.go(-1)">
              <el-icon>
                <Warning />
              </el-icon>
              {{ $LANG_TEXT("退出") }}
            </el-button> -->
          </div>
        </div>
      </div>
    </div>

    <div class="left-container">
      <!-- 顶部分类、组合 -->
      <div class="top-classify-box">
        <!-- 分类 -->
        <div class="classify-1">
          <tab-scroll v-model="chooseClassify" :options="{
            keyName: 'name',
            valueName: 'id',
          }" :optionsSecond="{
  keyName: 'nameLanguage',
  valueName: 'id',
}" :data="classifyList"></tab-scroll>
        </div>
        <!-- 组合 -->
        <div class="classify-2">
          <tab-scroll v-model="chooseCombine" :options="{
            keyName: 'name',
            valueName: 'id',
          }" :optionsSecond="{
  keyName: 'nameLanguage',
  valueName: 'id',
}" :data="combineList"></tab-scroll>
        </div>
      </div>

      <!-- 菜品列表 -->
      <div class="product-list-box">
        <!-- 菜谱列表 -->
        <div class="product-list ml-scrollbar">
          <div class="product-item" v-for="item in currCombine.goodsListFirst" :key="item.goodsId">
            <!-- binding a evnet of joinCar for each row of prodcut by zizhen guo 11/08/2023 -->
            <Product @changeCount="rightChangeCount($event, item)" @changeSpec="changeSpec" @pushNew="pushNewGoods"
              :imageWidth="185" productType="eatFood" :detail="item" />
          </div>
        </div>
        <div>
          <condiment v-if="chooseCarGoodsIndex.value === 0 || chooseCarGoodsIndex !== ''" :delItem="curDelItem" />
        </div>
        <!--菜谱列表 2 row: deleted below part becasue only keep the one prodcut component all information is laoded by below component! by zizhen guo -->
      </div>
    </div>
  </div>

  <!-- 加入 购物车 -->
  <!-- below component is discard, by zizhen guo -->
  <dialog-join-car @joinCar="joinCarResult($event)" :goodsId="dialogProduct.goodsId" :goodsType="dialogProduct.goodsType"
    :goodsSkuId="dialogProduct.skuId" :playType="routeParams.type" ref="joinCarRef">
  </dialog-join-car>

  <!-- 自定义菜品 -->
  <ml-dialog ref="customGoodsRef" :title="$LANG_TEXT('自定义菜品')" @confirm="customGoodsConfirm">
    <template #content>
      <ml-form :model="customGoodsParams" :rules="customGoodsRules" ref="customGoodsFormRef" :showBtn="false">
        <template #form>
          <el-form-item prop="name" :label="$LANG_TEXT('菜品名称')">
            <el-input :placeholder="$LANG_TEXT('请先输入菜品名称')" v-model="customGoodsParams.name"></el-input>
          </el-form-item>
          <el-form-item prop="price" :label="$LANG_TEXT('菜品价格')">
            <el-input type="number" :placeholder="$LANG_TEXT('请先输入菜品价格')" v-model="customGoodsParams.price"></el-input>
          </el-form-item>
        </template>
      </ml-form>
    </template>
  </ml-dialog>

  <!-- 功能窗口 -->
  <ml-dialog ref="toolDialogRef" :width="toolDialogWidthObj[toolDialogType] || '50%'"
    :title="$LANG_TEXT(toolDialogTitleObj[toolDialogType])" @confirm="toolDialogConfirm" @cancel="toolCancel"
    :confirmText="$LANG_TEXT(toolDialoConfirmTextObj[toolDialogType])"
    :cancelText="$LANG_TEXT(toolDialoCancelTextObj[toolDialogType] || '取消')" :showBtn="!toolDialogType == 'payment'">
    <template #content>
      <!-- 备注 -->
      <div v-if="toolDialogType == 'remark'">
        <el-input type="textarea" rows="10" @click="drawer = true" v-model="toolForm.remark"></el-input>
        <el-drawer v-model="drawer" :size="'45%'" :withHeader="false" :direction="'btt'" :before-close="handleClose">
          <div>
            <soft-keyboard-number :type="'multi'" :formObj="formData" :callerKeyboard="keyboardName"
              @changeInput="keyDown" @confirm="customerConfirmRemark">
            </soft-keyboard-number>
          </div>
        </el-drawer>
      </div>

      <!-- 折扣 -->
      <div v-if="toolDialogType == 'discount'">
        <discount-mod v-model:discountManner="toolForm.discountManner"
          :showProduct="!isEmpty.includes(chooseCarGoodsIndex)" v-model="toolForm.discount"
          @numberConfirm="discountNumberConfirm"></discount-mod>
      </div>

      <!-- 抹零 -->
      <div v-if="toolDialogType == 'notCount'">
        <not-count-mod v-model="toolForm.notCount"></not-count-mod>
      </div>

      <!-- 服务费 -->
      <div v-if="toolDialogType == 'service'">
        <service-charge-mod v-model="toolForm.service"></service-charge-mod>
      </div>

      <!-- 小费 -->
      <div v-if="toolDialogType == 'tip'">
        <tip-mod @confirm="toolDialogConfirm" v-model="toolForm.tip"></tip-mod>
      </div>

      <!-- 税率 -->
      <div v-if="toolDialogType == 'taxRate'">
        <tax-rate-mod v-model="toolForm.taxRate"></tax-rate-mod>
      </div>

      <!-- 合单 -->
      <div v-if="toolDialogType == 'consolidated'">
        <consolidated-mod v-model="toolForm.consolidated"></consolidated-mod>
      </div>

      <!-- 分额付款 -->
      <div v-if="toolDialogType == 'partialPay'">
        <partial-pay-mod v-model="toolForm.partialPay" :price="paidAmount"></partial-pay-mod>
      </div>

      <!-- 取消订单 -->
      <div v-if="toolDialogType == 'cancelingOrder'">
        <cancelling-order v-model="toolForm.cancelingOrder"></cancelling-order>
      </div>

      <!-- 免单 -->
      <div v-if="toolDialogType == 'freeCharge'">
        <free-order v-model="toolForm.freeChargeReason"></free-order>
      </div>
      <!-- 付款页面 -->
      <div v-if="toolDialogType == 'payment'">
        <payment v-model="routeParams" @submitOrder="stagingOrder($event, 'playOrder')">
        </payment>
      </div>
    </template>
  </ml-dialog>

  <!-- 人数键盘弹窗 -->
  <ml-dialog :showBtn="false" ref="peopelDialogRef" :title="$LANG_TEXT(peopelDialogTitles[peopelType])">
    <template #content>
      <div class="number-dialog-box">
        <div class="input-box">
          <el-form>
            <el-form-item>
              <el-input ref="peopelInputRef" class="big-keyboard" v-model="peopelValue"
                @click="openKeyboard('peopel')"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="number-keyboard">
          <soft-keyboard-number :tp="routeParams.type" :peopelval="peopelValue" :callerKeyboard="callerKeyboard"
            @confirm="peopelDialogConfirm" @handleClose="handlepeopelClose" @changeInput="keyDown"></soft-keyboard-number>
        </div>
      </div>
    </template>
  </ml-dialog>

  <!-- 座位键盘弹窗 -->
  <ml-dialog width="595px" :showBtn="false" ref="seatDialogRef" :title="$LANG_TEXT('更新座位')">
    <template #content>
      <div class="number-dialog-box">
        <div class="input-box">
          <el-form>
            <el-form-item>
              <el-input ref="seatInputRef" class="big-keyboard" v-model="seatValue"
                @click="openKeyboard('seat')"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="number-keyboard">
          <soft-keyboard-number type="seat" :tp="routeParams.type" :seatval="seatValue" :callerKeyboard="callerKeyboard"
            @confirm="seatDialogConfirm" @handleClose="handleseatClose" @changeInput="keyDown"></soft-keyboard-number>
        </div>
      </div>
    </template>
  </ml-dialog>

  <!-- 客户基本信息弹窗 -->
  <customer-user-dialog v-model:data="customerData" @confirm="customerConfirm" ref="customerDialogRef">
  </customer-user-dialog>

  <!-- 提示 -->
  <ml-dialog width="595px" ref="paidPayDialogRef" :cancelText="$LANG_TEXT('取消支付')" :confirmText="$LANG_TEXT('前往支付')"
    :title="$LANG_TEXT('账单提示')" @confirm="paidPayGo" @cancel="cancelPaidPay">
    <template #content>
      <div class="paid-pay">
        <h4 class="tips">
          {{ $LANG_TEXT("您有一个账单正在进行中，请前往结账") }}
        </h4>
      </div>
    </template>
  </ml-dialog>

  <!-- 类型选择窗口 -->
  <ml-dialog width="595px" ref="typeChangeDialogRef" :cancelText="$LANG_TEXT('取消支付')" :confirmText="$LANG_TEXT('前往支付')"
    :title="$LANG_TEXT('类型选择')" :showBtn="false" @confirm="paidPayGo" @cancel="cancelPaidPay">
    <template #content>
      <div class="paid-pay">
        <h4 class="tips">
          {{ $LANG_TEXT("订单类型") }}
        </h4>
        <el-button @click="typeChange('EAT_IN')">堂吃</el-button>
        <el-button @click="typeChange('TAKE_FOOD')">等取</el-button>
        <el-button @click="typeChange('TAKE_OUT')">外送</el-button>
      </div>
    </template>
  </ml-dialog>

  <!-- 服务员表格弹窗 -->
  <ml-dialog width="595px" ref="waiterNameDialogRef" :title="$LANG_TEXT('选择服务员')" :showBtn="false">
    <template #content>
      <div class="filter-box"></div>

      <div class="table-box">
        <!-- 表格 -->
        <ml-table @currentChange="currentChangeWaiterName" ref="tableRef" :tableData="tableData"
          :templateData="templateData" :pageParams="pageParams">
          <template #waiterType="{ row }">
            {{
              $LANG_TEXT(userTypes.find((d) => d.value == row.waiterType).label)
            }}
          </template>
        </ml-table>
      </div>
    </template>
  </ml-dialog>
  <!-- 折扣按钮弹窗  -->
  <ml-dialog width="375px" ref="discountDialogRef" :title="$LANG_TEXT('折扣')" :showBtn="false">
    <template #content>
      <div class="other-btn-box">
        <!-- 处理订单、打折为空、不允许打折 移至其他按钮下 -->
        <el-button type="warning" v-if="proxy.$isUseAuth('折扣')" :disabled="!routeParams.orderId ||
          (!isEmpty.includes(chooseCarGoodsIndex)
            ? (chooseCartData.isDiscount == 'NO' ||
              !chooseCartData.isDiscount) & !!routeParams.orderId
            : false) ||
          isInPay
          " @click.stop="openToolDialog('discount')">
          <el-icon>
            <PriceTag />
          </el-icon>
          {{ $LANG_TEXT("折扣") }}
        </el-button>
        <el-button type="primary" :disabled="!routeParams.orderId ||
          isEmpty.includes(toolForm.notCount.maLingMoney) ||
          isInPay
          " @click.stop="openToolDialog('notCount')">
          <el-icon>
            <PriceTag />
          </el-icon>
          {{ $LANG_TEXT("抹零") }}
        </el-button>
        <el-button v-if="proxy.$isUseAuth('服务费')" type="info" :disabled="!routeParams.orderId || isInPay"
          @click.stop="openToolDialog('service')">
          <el-icon>
            <PriceTag />
          </el-icon>
          {{ $LANG_TEXT("服务费") }}
        </el-button>
        <el-button type="warning" :disabled="!routeParams.orderId || isInPay" @click.stop="openToolDialog('tip')">
          <el-icon>
            <PriceTag />
          </el-icon>
          {{ $LANG_TEXT("小费") }}
        </el-button>
      </div>
    </template>
  </ml-dialog>

  <!-- 其他按钮弹窗 -->
  <ml-dialog width="375px" ref="otherDialogRef" :title="$LANG_TEXT('其他')" :showBtn="false">
    <template #content>
      <div class="other-btn-box">
        <el-button v-if="proxy.$isUseAuth('税率')" type="warning" :disabled="!routeParams.orderId || isInPay"
          @click.stop="handClickOtherBtn(openToolDialog, 'taxRate')">
          <el-icon>
            <PriceTag />
          </el-icon>
          {{ $LANG_TEXT("税率") }}
        </el-button>
        <el-button type="primary" :disabled="!routeParams.orderId || isInPay"
          @click.stop="handClickOtherBtn(openToolDialog, 'freeCharge')">
          {{ $LANG_TEXT("免单") }}
        </el-button>
        <el-button v-if="proxy.$isUseAuth('分单')" type="primary" @click.stop="
          handClickOtherBtn(() => {
            $navigateTo('/eatFoodSplitOrder', routeParams);
          })
          " :disabled="eatFoodModule.chooseOrderType != 'orderCarData' || isInPay">
          {{ $LANG_TEXT("菜品分单") }}
        </el-button>

        <el-button v-if="proxy.$isUseAuth('合单')" type="primary" :disabled="!routeParams.orderId || isInPay"
          @click.stop="handClickOtherBtn(openToolDialog, 'consolidated')">
          {{ $LANG_TEXT("合单") }}
        </el-button>
        <el-button type="info" :disabled="!routeParams.orderId ||
          !getTypeStatusBtn('AA_PAY') ||
          routeParams.peopleQuantity == 0 ||
          !isOrdered
          " @click.stop="handClickOtherBtn(openPeopelDialog, 'AA')"><el-icon>
            <WalletFilled />
          </el-icon>
          {{ $LANG_TEXT("AA付款") }}
        </el-button>
        <el-button :disabled="!routeParams.orderId || !getTypeStatusBtn('SHARE_PAY') || !isOrdered
          " type="info" @click.stop="handClickOtherBtn(openToolDialog, 'partialPay')">
          <el-icon>
            <WalletFilled />
          </el-icon>
          {{ $LANG_TEXT("分额付款") }}
        </el-button>
        <!-- 取消订单 -->
        <el-button v-if="proxy.$isUseAuth('取消订单')" :disabled="!routeParams.orderId" type="info"
          @click.stop="openToolDialog('cancelingOrder')">
          {{ $LANG_TEXT("取消订单") }}
        </el-button>
        <!-- 自定义菜品 -->
        <el-button :disabled="isInPay" v-if="proxy.$isUseAuth('自定义菜品')" @click.stop="openCustomGoodsDialog">
          {{ $LANG_TEXT("自定义菜品") }}
        </el-button>
      </div>
    </template>
  </ml-dialog>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  watch,
  getCurrentInstance,
  computed,
  nextTick,
  provide,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { testPositiveNumberFlot } from "@/utils/regExp";
import { storeToRefs } from "pinia";
import { userTypeOpts } from "@/utils/options";
import Product from "@/components/product.vue";
import tabScroll from "@/components/tab-scroll";
import listItem from "./components/list-item.vue";
import discountMod from "./components/discount-mod.vue";
import notCountMod from "./components/not-count-mod.vue";
import serviceChargeMod from "./components/service-charge-mod.vue";
import tipMod from "./components/tip-mod.vue";
import taxRateMod from "./components/tax-rate-mod.vue";
import consolidatedMod from "./components/consolidated-mod.vue";
import partialPayMod from "./components/partial-pay-mod.vue";
import cancellingOrder from "./components/cancelling-order.vue";
import freeOrder from "./components/free-order.vue";
import customerUserDialog from "./components/customer-user-dialog.vue";
import condiment from "./components/condiment.vue";
import payment from "./direct-payment.vue"
import { SelectProps } from "element-plus/es/components/select-v2/src/defaults";

const { proxy } = getCurrentInstance();

const route = useRoute();
console.log(route);
const routeQuery = reactive(route.query || {});
const router = useRouter();

// 用户类型
const userTypes = userTypeOpts();

// 判断是否是已下单的订单
const isOrdered = computed(() => {
  // 订单购物车数据
  const OCData = orderCarData.value.reduce((add, curr) => {
    return add.concat(curr.goodsList || []);
  }, []);
  // 订单暂存购物车数据
  const TCData = stagingCarData.value.reduce((add, curr) => {
    return add.concat(curr.goodsList || []);
  }, []);

  // console.log(OCData)
  // console.log(TCData)
  // 已有下单&&无暂存
  return OCData.length && !TCData.length;
});

// 携带参数
const routeParams = reactive({
  orderId: "",
  id: "",
  serveDishesWay: "",
  remark: "",
  type: "",
  peopleQuantity: "",
  location: "",
  userName: "",
  contactWay: "",
  address: "",
  waiterName: "",
});

// 额外费用类型
const otherPriceType = {
  QUOTA: "定额",
  PERCENT: "百分比",
};

// 全局模块
const { eatFoodModule, mainModule } = proxy.$usePiniaModule();
// 已加入购物车
const { addedToCart } = storeToRefs(eatFoodModule);
console.log('已加入购物车数据', addedToCart.value);

// 基本信息
const baseConfigInfo = computed(() => mainModule.baseConfigInfo);

// 分类列表
const classifyList = ref([]);
// 选中分类ID
const chooseClassify = ref("");
watch(
  () => chooseClassify.value,
  (nVal) => {
    getSellDishesCombineList();
  }
);
// 菜品明细 额外
const goodsDetailed = computed(() => {
  const baseInfo = baseConfigInfo.value;
  // 金额显classifyList
  // const showMoney = baseInfo.showMoney;
  // const showMoneyType = showMoney == "ORIGINAL_VALUE" ? "原值" : "四舍五入";

  const { tip } = toolForm;

  // 折扣
  const discount = toolForm.discount;
  const discountItem =
    [
      {
        value: discount.cashDiscountMoney,
        label: "现金折扣",
      },
      {
        value: discount.order.orderDiscount,
        label: "订单折扣",
        item: discount.order,
      },
    ].find((item) => item.value) || {};

  let discountType = {
    label: "",
    value: "",
  };
  if (!discount.cashDiscountMoney) {
    if (discountItem.value) {
      // 解除上下文绑定
      const item = JSON.parse(JSON.stringify(discountItem.item));
      if (discountItem.label == "订单折扣") {
        item.orderDiscount = item ? 100 - item.orderDiscount : 0;
        const res = getPercentageQuota(item, {
          valueName: "orderDiscount",
          typeName: "orderDiscountType",
        });
        discountType.label = "订单折扣";
        discountType.value = item.orderDiscount ? res : 0;
      }
    }
  } else {
    discountType.label = "现金折扣";
    discountType.value = "$" + discount.cashDiscountMoney;
  }

  // 折扣方式
  let discountMannerText = "";
  if (toolForm.discountManner) {
    discountMannerText =
      toolForm.discountManner == "ALL" ? "所有商品" : "非打折商品";
  }

  // 外卖费用
  const deliveryFee = baseInfo.deliveryFee;
  const deliveryFeeValue = deliveryFee
    ? "$" + deliveryFee
    : proxy.$LANG_TEXT("暂无");

  // 服务费用
  const serviceOpt = toolForm.service;
  const serviceChargeType = serviceOpt.serviceChargeType;
  const serviceChargeTypeText = otherPriceType[serviceChargeType];
  let serviceValue = "";
  if (serviceChargeType) {
    serviceValue = getPercentageQuota(serviceOpt, {
      valueName: "serviceCharge",
      typeName: "serviceChargeType",
    });
  } else {
    serviceValue = proxy.$LANG_TEXT("暂无");
  }

  // 税率
  const taxRateValue = `${toolForm.taxRate}%`;

  // 抹零
  const maLingType = toolForm.notCount.maLingText || proxy.$LANG_TEXT("不抹");

  // 小费
  const tipText = (tip || {}).payAmount ? `$${tip.payAmount}` : "";

  return {
    // showMoneyType,
    serviceChargeTypeText,
    discountMannerText,
    discountType,
    deliveryFeeValue,
    serviceValue,
    taxRateValue,
    tipText,
    maLingType,
    isFreeOrder: proxy.$LANG_TEXT(
      isStatus[orderDetail.value.isFreeOrder || "否"]
    ),
  };
});

// 是否
const isStatus = {
  YES: "是",
  NO: "否",
};

// 判断百分比、定额
const getPercentageQuota = (result, pot) => {
  const { valueName, typeName, pUnit = "%", qUnit = "$" } = pot || {};
  const value = result[valueName];
  const type = result[typeName];
  if (type == "PERCENT") {
    return `${value}${pUnit}`;
  } else {
    return `${qUnit}${value}`;
  }
};

// 上菜方式
const serveDishesWayOpts = computed(() => {
  const { servingMethod, servingMethodLanguage } = baseConfigInfo.value;
  const opts = (
    mainModule.isSecondLanguage ? servingMethodLanguage : servingMethod
  ).split(",");
  return opts;
});

// 多功能弹窗标题
const toolDialogTitleObj = {
  remark: "备注",
  discount: "折扣",
  notCount: "抹零",
  service: "服务费",
  tip: "小费",
  taxRate: "税率",
  freeCharge: "免单",
  consolidated: "合单",
  partialPay: "分额支付",
  cancelingOrder: "取消订单",
  payment: "付款"
};
// 多功能弹窗确认文字
const toolDialoConfirmTextObj = {
  discount: "确认折扣",
  notCount: "确认抹零",
  service: "确认服务费",
  tip: "确认小费",
  taxRate: "确认税率",
  freeCharge: "确认免单",
  consolidated: "确认合单",
  partialPay: "确认分单",
  cancelingOrder: "确认订单",
};
// 多功能弹窗取消文字
const toolDialoCancelTextObj = {
  freeCharge: "取消免单",
};
// 多功能弹窗宽度
const toolDialogWidthObj = {
  tip: "665px",
  consolidated: "1000px",
  partialPay: "1000px",
};

// 获取售卖菜品组合列表
const getSellDishesClassifyList = async () => {
  const res = await proxy.$storeDispatch("fetchGetSellDishesClassifyList");
  const result = res.result || [];

  classifyList.value = result;

  // 赋值查询
  chooseClassify.value = (result[0] || {}).id;
};

// 判空
const isEmpty = ["", undefined, null];

// 组合列表
const combineList = ref([]);
// 选中ID
const chooseCombine = ref("");
// 获取售卖菜品组合列表
const getSellDishesCombineList = async () => {
  const classifyId = chooseClassify.value;
  const res = await proxy.$storeDispatch(
    "fetchGetSellDishesClassifyCombineList",
    classifyId
  );
  const result = res.result || [];

  combineList.value = result;
  chooseCombine.value = (result[0] || {}).id;

  setTimeout(() => {
    proxy.$forceUpdate();
  });
};

// 当前组合
const currCombine = computed(() => {
  // 堂食、等取
  const eats = ["EAT_IN", "TAKE_FOOD"];
  const id = chooseCombine.value;
  const chooseItem = combineList.value.find((item) => item.id == id) || {};
  // console.log(chooseItem);
  const result = (chooseItem.goodsList || []).map((item) => {
    let showPrice = 0;

    // 菜品
    if (item.goodsType == "DISHES") {
      if (eats.includes(routeParams.type)) {
        const price = item.price;
        const activityPrice = item.activityPrice;
        showPrice = isEmpty.includes(activityPrice) ? price : activityPrice;
      } else {
        // 外卖
        const activityPrice = item.activityPrice;
        const deliveryPrice = item.deliveryPrice;
        showPrice = isEmpty.includes(activityPrice)
          ? deliveryPrice
          : activityPrice;
      }
      item.price = showPrice;
    }

    // // 原值
    // if (baseConfigInfo.value.showMoney == "ORIGINAL_VALUE") {
    // } else {
    // 	// 四舍五入
    // 	item.price = Math.round(showPrice);
    // }
    return item;
  });
  // config all prodcuts displayed by order by zizhen guo 
  chooseItem.goodsListFirst = result.filter((item, index) => !(index % 1));
  // chooseItem.goodsListSecond = result.filter((item, index) => index % 2);
  // console.log(chooseItem);
  return chooseItem;
});

// 加入购物车
// ref
const joinCarRef = ref();
const curDelItem = ref({})
//右侧 菜品数量变动 加入购物车
const rightChangeCount = (count, item) => {
  // 已加入购物车中是否存在该菜品
  const isHave = addedToCart.value.find((d) => d.goodsId == item.goodsId);
  // console.log(item)
  // console.log(addedToCart.value)
  // if (isHave) {
  //   // 增加数量
  //   const index = addedToCart.value.findIndex((d) => d.goodsId == item.goodsId);
  //   addedToCart.value[index].goodsQuantity = count;
  // } else {
  item.goodsQuantity = 1;
  addedToCart.value.push(item);
  // }

  // console.log(addedToCart);
};

// 获取当前已在购物车中的商品状态
const getItemStatus = (item) => {
  // if(item.isDiscount == 'YES'){
  // 	return '已折扣'
  // }else{
  // 	// 是否已在数据库生成 数据
  // 	if(item.id){
  // 		return '已发送'
  // 	}else{
  // 	return ''
  // 	}
  // }
};

// 选择规格 选中的菜品
const dialogProduct = ref({});

// 右侧 选择规格
const changeSpec = (detail) => {
  console.log(detail);
  console.log(detail.skuId);
  dialogProduct.value = detail;
  joinCarRef.value.openDialog();
};

// 加入新菜品
const pushNewGoods = (goods) => {
  console.log(goods);
  const items = addedToCart.value.filter(
    (item) => item.goodsId == goods.goodsId
  );
  const hasSpicesList = addedToCart.value.findIndex(
    (item) =>
      !(item.customDishesSpicesList || []).length &&
      item.goodsId == goods.goodsId
  );
  const Paid = addedToCart.value.findIndex(
    (item) =>
      !(item.status == "ALREADY") &&
      item.goodsId == goods.goodsId
  );
  console.log(Paid);
  console.log(hasSpicesList);
  // console.log(goods);
  // console.log(items);
  // console.log(goodsIndex);
  // 存在自定义调味品
  if (Paid == -1) {
    //已付，调味
    goods.goodsQuantity = 1;
    const copiedItem = JSON.parse(JSON.stringify(goods));
    delete copiedItem.customDishesSpicesList;
    console.log(copiedItem);
    addedToCart.value.push(copiedItem);
  } else {
    //有未付，无调味，加自己
    if (hasSpicesList !== -1) {
      if (Paid >= hasSpicesList) {
        addedToCart.value[Paid].goodsQuantity += 1;
      } else {
        addedToCart.value[hasSpicesList].goodsQuantity += 1;
      }
    } else {
      goods.goodsQuantity = 1;
      const copiedItem = JSON.parse(JSON.stringify(goods));
      delete copiedItem.customDishesSpicesList;
      console.log(copiedItem);
      addedToCart.value.push(copiedItem);
    }
  }
};
// 规格弹窗 确认加入购物车
const joinCarResult = (result) => {
  // 已加入购物车中是否存在该菜品
  console.log("new spec is added into the chat ");
  console.log(result);
  let isHave = addedToCart.value.findIndex((d) => d.skuId == result.skuId);
  console.log(isHave);
  if (isHave == -1) {
    result.goodsQuantity = 1;
    addedToCart.value.push(result);
    console.log(addedToCart);
    joinCarRef.value.closeDialog();
  } else {
    result.goodsQuantity = 1;
    addedToCart.value[isHave].dishesSpecificationList = result.dishesSpecificationList;
    addedToCart.value[isHave].dishesSpicesList = result.dishesSpicesList;
    console.log(addedToCart);
    joinCarRef.value.closeDialog();
  }
};

// 购物车列表
// 监听数量变动
const carListChangeCount = (count, item, index) => {
  setTimeout(async () => {
    // goodsType
    // DISHES:菜品、CUSTOM_DISHES:自定义菜品、SET_MEAL:套餐

    console.log(item, index);
    console.log(addedToCart);

    if (item.stockCount) {
      if (item.stockCount <= count) {
        item.addDisabled = true;
        return;
      } else {
        item.addDisabled = false;
      }
    }
    // 对比位置
    if (chooseCarGoodsIndex.value == index) {
      if (!item.goodsQuantity) {
        // 重置
        chooseCarGoodsIndex.value = "";
      }
    }

    // 自定义菜品 废弃
    // if (item.goodsType == "CUSTOM_DISHES") {
    // 	// console.log(item.goodsQuantity);
    // 	// 清除数据
    // 	if (!item.goodsQuantity) {
    // 		addedToCart.value.splice(index, 1);
    // 	}
    // }

    // 订单菜品
    if (item.orderType) {
      if (!item.goodsQuantity) {
        await cancelDishes(item.shopId);
      } else {
        // 改变数量
        await proxy.$storeDispatch("fetchEditOrderGoodsQuantity", {
          id: item.shopId,
          quantity: item.goodsQuantity,
        });
      }
    }
    nextTick(() => {
      // 清除数据
      if (!item.goodsQuantity) {
        console.log("清除数据");
        console.log(item);
        console.log(item.goodsQuantity);
        addedToCart.value.splice(index, 1);
      }
    });
  });
};
// 取消菜品
const cancelDishes = async (ids) => {
  // 取消菜品
  await proxy.$storeDispatch("fetchCancelingBatchOrderGoods", {
    ids,
  });
};
// 删除菜品操作
const deleteDishes = async () => {
  const index = chooseCarGoodsIndex.value;
  const item = addedToCart.value[index];
  // console.log(item)

  if (item.shopId) {
    await cancelDishes(item.shopId);
    addedToCart.value.splice(index, 1);
  } else {
    addedToCart.value.splice(index, 1);
  }
};
//删除调味品
const deleteCondiment = (value, index) => {
  curDelItem.value = value
  console.log(value);
  console.log(index);
  console.log(addedToCart.value[index].customDishesSpicesList);
  let specificationExist = value.item.dishesSpecificationAttributeList
  let spiceExist = value.item.dishesSpicesAttributeList
  let condiIndex = value.index;
  console.log("list item  is " + specificationExist);
  console.log("list item  is " + spiceExist);
  console.log("list item  is " + condiIndex);
  if (specificationExist) {
    delete addedToCart.value[index].dishesSpecificationList
    //addedToCart.value[index].dishesSpecificationList = addedToCart.value[index].dishesSpecificationList.filter(item => item);
  }
  if (spiceExist) {
    console.log("checek white rice is run")
    delete addedToCart.value[index].dishesSpicesList;
    //addedToCart.value[index].dishesSpicesList = addedToCart.value[index].dishesSpicesList.filter(item => item);
  }
  if (isEmpty.includes(specificationExist && spiceExist)) {
    console.log("check other condiment is run")
    let condiName = value.item.name;
    console.log(condiName);
    let indexInSicesList = addedToCart.value[index].customDishesSpicesList.findIndex(item => item.name == condiName);
    console.log(indexInSicesList);
    delete addedToCart.value[index].customDishesSpicesList[indexInSicesList]
    addedToCart.value[index].customDishesSpicesList = addedToCart.value[index].customDishesSpicesList.filter(item => item);
  }
};

//修改之前在弹窗中选中的内容
const changeCondiment = () => {

}

// 多功能按钮

// 暂存订单、下单 提交数据
const orderSubmitData = computed(() => {
  // 需要提交的数据
  const shoppingGoodsList = [];
  // 解除关联
  const carList = JSON.parse(JSON.stringify(addedToCart.value));

  // console.log(addedToCart.value)
  for (let i = 0; i < carList.length; i++) {
    // 菜品、自定义菜品、自定义调味品、套餐、调味品
    const item = carList[i];

    // console.log(item);
    // 只允许暂存、静态数据进入
    if (!item.orderType) {
      const goodsType = item.goodsType;
      const goodsQuantity = item.goodsQuantity;
      const remark = item.remark || "";
      const serveDishesWay = item.serveDishesWay || "";
      const goodsId = item.goodsId || "";
      const dishesSpicesList = item.dishesSpicesList || [];
      const result = {
        goodsType,
        goodsQuantity,
        goodsId,
        dishesSpicesList,
        remark,
        serveDishesWay,
      };

      // 调味品
      result.customDishesSpicesList = item.customDishesSpicesList;

      if (goodsType == "DISHES") {
        //菜品
        // 规格类型（SINGLE:单规格、MULTI:多规格）
        const specificationType = item.specificationType;
        // 处理规格
        if (specificationType == "MULTI") {
          result.dishesSpecificationList = getParentChildsIds(
            item.dishesSpecificationList || [],
            { childName: "dishesSpecificationAttributeList" }
          );
        }

        shoppingGoodsList.push(result);
      } else if (goodsType == "CUSTOM_DISHES") {
        //自定义菜品
        result.customDishes = {
          name: item.name,
          price: item.price,
        };
        shoppingGoodsList.push(result);
      } else if (goodsType == "SET_MEAL") {
        //套餐
        result.setMealSpecificationList = getParentChildsIds(
          item.specificationList,
          {
            childName: "setMealSpecificationDishesList",
            useChildName: "setMealSpecificationDishesList",
          }
        );
        shoppingGoodsList.push(result);
      }
    }
  }

  return {
    ...routeParams,
    taxRate: toolForm.taxRate,
    shoppingGoodsList,
  };
});
// 暂存订单、下单
// playOrder、storeOrder
const stagingOrder = async (params, type) => {
  console.log("this is line 1380 " + params.value);
  if (!addedToCart.value.length) {
    proxy.$message({
      type: "warning",
      message: proxy.$LANG_TEXT("请先添加菜品"),
    });
    call();
    return;
  }

  const apiUrl =
    type == "playOrder" ? "fetchEatFoodAddOrder" : "fetchAddTemporaryOrder";
  const tips = type == "playOrder" ? "下单" : "暂存";

  // console.log(addedToCart.value);
  // console.log(getTotalOrderAmount.value);
  // console.log(orderSubmitData.value);

  try {
    await proxy
      .$storeDispatch(apiUrl, {
        ...orderSubmitData.value,
      })
      .then(async (res) => {
        proxy.$message({
          type: "success",
          message: proxy.$LANG_TEXT(tips + "成功"),
        });
        // 订单号
        routeParams.orderId = res.result;
        await getOrderIdDetail(res.result);
        // 重置
        addedToCart.value = [];
      });
    if (type == "playOrder") {
      let printType = 1;
      if (params.paymentMethodName) {
        await proxy.$storeDispatch("fetchInitiateOrderDirectPay", routeParams.orderId);
        const res = await proxy.$storeDispatch("fetchGetOrderPayDetailList", routeParams.orderId);
        const result = {}
        result.id = res.result[0].id
        result.payAmount = orderDetail.value.actuallyPaidMoney;
        result.paymentMethodName = params.paymentMethodName;
        result.paymentMethodNameLanguage = params.paymentMethodNameLanguage;
        await proxy.$storeDispatch("fetchPayOrderAmount", result);
        proxy.$message.success(proxy.$LANG_TEXT("结账完成"));
        printType = 2;
        //router.push({ path: "/printMod", query: { orderId: routeParams.orderId, type: 0, autoPrinted:2 }});
      }
      toolDialogRef.value.closeDialog();
      router.push({ path: "/printMod", query: { orderId: routeParams.orderId, type: 0, autoPrinted: printType } });
    }
  } catch (error) {
    console.log(error)
  }
};

// 获取父级子级id数据
const getParentChildsIds = (list = [], opt = {}) => {
  return list.map((d) => {
    return {
      id: d.id,
      [opt.useChildName || opt.childName]: (d[opt.childName] || []).map(
        (da) => ({ id: da.id })
      ),
    };
  });
};

// 自定义菜品
// ref
const customGoodsRef = ref();
const customGoodsFormRef = ref();
// 参数
const customGoodsParams = reactive({
  name: "",
  price: "",
});
// 规则
const customGoodsRules = reactive({
  name: [
    {
      message: proxy.$LANG_TEXT("请先输入菜品名称"),
      required: true,
      trigger: "change",
    },
  ],
  price: [
    {
      message: proxy.$LANG_TEXT("请先输入菜品价格"),
      required: true,
      trigger: "change",
    },
    {
      validator: (rule, value, call) => {
        if (testPositiveNumberFlot(value)) {
          call();
        } else {
          call(new Error(proxy.$LANG_TEXT("请输入正常价格")));
        }
      },
    },
  ],
});
// 打开弹窗
const openCustomGoodsDialog = () => {
  for (let i in customGoodsParams) {
    customGoodsParams[i] = "";
  }
  customGoodsRef.value.openDialog();
  nextTick(() => {
    customGoodsFormRef.value.resetFields();
  });
};
// 查询全部订单
const goBack = () => {
  proxy.$navigateTo("/order");
};
// 添加
const customGoodsConfirm = (call) => {
  const testRes = proxy.$testForm(call, customGoodsFormRef.value);

  if (!testRes) {
    return;
  }

  addedToCart.value.push({
    ...customGoodsParams,
    goodsQuantity: 1,
    goodsType: "CUSTOM_DISHES",
  });
  call();
  customGoodsRef.value.closeDialog();
  // console.log(customGoodsParams)
};

// 选择的菜品
const chooseCarGoodsIndex = ref("");
watch(
  () => chooseCarGoodsIndex.value,
  (nVal) => {
    const item = addedToCart.value[nVal];
    const { serveDishesWay = "", remark = "" } = orderDetail.value;
    // 菜品
    if (item) {
      // // 上菜方式
      // routeParams.serveDishesWay = item.serveDishesWay;
      // // 备注
      // toolForm.remark = item.remark;
    } else {
      //订单
      // 上菜方式
      routeParams.serveDishesWay = serveDishesWay;
      // 备注
      toolForm.remark = remark;
    }
  }
);

// 修改已下单菜品信息
const updateOrderDishes = async (params) => {
  await proxy.$storeDispatch("fetchEditOrderShoppingGoods", params);
};

const changeCarListItem = (index) => {

  console.log("product name is selected with index is " + index)

  if (chooseCarGoodsIndex.value === "") {
    chooseCarGoodsIndex.value = index;
    return;
  }
  if (chooseCarGoodsIndex.value !== index) {
    chooseCarGoodsIndex.value = index;
  } else {
    chooseCarGoodsIndex.value = "";
  }
};

provide('index', chooseCarGoodsIndex);
// 购物车当前选择数据
const chooseCartData = computed(() => {
  const index = chooseCarGoodsIndex.value;
  if (!isEmpty.includes(index)) {
    const item = addedToCart.value[index] || {};

    return item;
  } else {
    return {};
  }
});

// 调味品
// 去往设置调味品
const setCondiment = () => {
  if (chooseCarGoodsIndex.value === "") {
    return;
  }
  const item = addedToCart.value[chooseCarGoodsIndex.value];
  // console.log(item);
  const { name, nameLanguage, price } = item;
  // proxy.$navigateTo("eatFoodCondiment", {
  //   carIndex: chooseCarGoodsIndex.value,
  //   name,
  //   nameLanguage: nameLanguage || name,
  //   price,
  // });
};

// 当前打开多功能类型
const toolDialogType = ref("");
// ref
const toolDialogRef = ref();
// 打开多功能弹窗
const openToolDialog = (type) => {
  toolDialogType.value = type;

  // 合单赋值当前订单号
  if (type == "consolidated") {
    toolForm.consolidated.mainOrder = routeParams.orderId;
  } else if (type == "partialPay") {
    // 是否已发起支付
    const isSend = orderDetail.value.isInitiatePay;
    if (isSend == "YES") {
      jumpPaypartial();

      return;
    }
  } else if (type == "notCount") {
    //抹零赋值
    toolForm.notCount.maLingMoney = getTotalOrderAmount.value.payPrice;
  }

  // // 是否选中了菜品
  // 赋值菜品折扣
  if (chooseCartData.value.isDiscount == "YES") {
    const { dishesDiscountType, dishesDiscount } = chooseCartData.value;
    toolForm.discount.product = {
      dishesDiscountType,
      dishesDiscount,
    };
  } else {
    toolForm.discount.product = {
      dishesDiscountType: "",
      dishesDiscount: "",
    };
  }

  // 备注
  if (type == "remark") {
    const index = chooseCarGoodsIndex.value;
    const item = addedToCart.value[index];
    if (item) {
      toolForm.remark = item.remark;
    } else {
      toolForm.remark = routeParams.remark;
    }
  }

  toolDialogRef.value.openDialog();
  nextTick(() => {
    // console.log(toolForm);
  });
};
// 多功能表单
const toolForm = reactive({
  remark: "",
  // 折扣
  discount: {
    cashDiscountMoney: "",
    order: {
      orderDiscount: "",
      orderDiscountType: "",
    },
    product: {
      dishesDiscount: "",
      dishesDiscountType: "",
    },
  },
  // 折扣类型
  discountManner: "ALL",
  // 抹零
  notCount: {
    maLingMoney: "",
    maLingType: "NO",
    maLingText: "不抹",
  },
  // 服务费
  service: {
    serviceChargeType: "",
    serviceCharge: "",
  },
  // 小费
  tip: {
    payAmount: "",
    paymentMethodName: "",
    paymentMethodNameLanguage: "",
  },
  // 税率
  taxRate: 0,
  // 合单
  consolidated: {
    mainOrder: "",
    order: "",
  },
  // 分额
  partialPay: {
    amount: [],
    dividedNumber: 0,
  },
  // 取消订单原因
  cancelingOrder: "",
  // 免单原因
  freeChargeReason: "",
  // 免单金额
  freeChargePrice: "",
});

// 抹零金额
const notCountPrice = computed(() => {
  return toolForm.freeChargePrice
    ? toolForm.freeChargePrice
    : (
      getTotalOrderAmount.value.payPrice - toolForm.notCount.maLingMoney
    ).toFixed(2);
});

// 确认
const toolDialogConfirm = async (call) => {
  switch (toolDialogType.value) {
    case "remark":
      const index = chooseCarGoodsIndex.value;
      // 选择了菜品
      if (!isEmpty.includes(index)) {
        addedToCart.value[index].remark = toolForm.remark || "";

        const item = addedToCart.value[index];
        // 已下单
        if (item.orderType) {
          updateOrderDishes({ remark: toolForm.remark, id: item.shopId });
        }
      } else {
        //订单
        // 备注
        // 赋值显示
        routeParams.remark = toolForm.remark;
        updateOrder({ remark: toolForm.remark });
      }

      closeToolDialog(call);
      break;
    case "discount":
      // 菜品
      if (toolForm.discount.product.dishesDiscountType) {
        // 赋值菜品信息
        const currIndex = chooseCarGoodsIndex.value;
        const dishe = addedToCart.value[currIndex];
        // 赋值折扣
        const discountPro = toolForm.discount.product;
        for (let i in discountPro) {
          addedToCart.value[currIndex][i] = discountPro[i];
        }
        // 打折金额
        addedToCart.value[currIndex].discountPrice =
          proxy.$sumDisheDiscountPrice(dishe);

        updateOrderDishes({
          id: dishe.shopId,
          ...discountPro,
        });
      } else {
        const { discount, discountManner } = toolForm;
        if (discount.order.orderDiscountType) {
          // 折扣
          updateOrder({
            discountManner,
            discountType: "ORDER",
            ...discount.order,
            cashDiscountMoney: "",
          });
        } else {
          // 折扣
          updateOrder({
            cashDiscountMoney: discount.cashDiscountMoney || 0,
            discountType: "CASH",
            discountManner,
            ...discount.order,
          });
        }
        console.log(discount);
      }
      // 关闭
      closeToolDialog(call);
      break;
    case "notCount":
      // 抹零
      updateOrder(toolForm.notCount);
      // console.log(toolForm.notCount);
      // 关闭
      closeToolDialog(call);
      break;
    case "service":
      // 服务费
      // console.log(toolForm.service)

      updateOrder(toolForm.service);
      // 关闭
      closeToolDialog(call);
      break;
    case "tip":
      // 小费
      await playTipApi(toolForm.tip);
      // 关闭
      closeToolDialog(call);
      getOrderTippingList();

      break;
    case "taxRate":
      // console.log(toolForm.taxRate)
      // 税率
      updateOrder({ taxRate: toolForm.taxRate });
      // 关闭
      closeToolDialog(call);
      break;
    case "consolidated":
      // 合单
      const { mainOrder, order } = toolForm.consolidated;
      // console.log(toolForm.consolidated);
      if (!mainOrder || !order) {
        proxy.$message({
          type: "warning",
          message: proxy.$LANG_TEXT("请先选择要合并的订单"),
        });
        call();
        return;
      }
      // 合并
      consolidateOrder(toolForm.consolidated);
      // 关闭
      closeToolDialog(call);
      break;
    case "partialPay":
      // 分额
      sendPartialPay(toolForm.partialPay);
      // 关闭
      closeToolDialog(call);
      break;
    case "cancelingOrder":
      // 取消订单
      // console.log(toolForm.cancelingOrder)
      cancelOrderApi({
        canceledReason: toolForm.cancelingOrder,
      });
      // 关闭
      closeToolDialog(call);
      router.go(-1);
      break;
    case "freeCharge":
      // 免单
      // console.log(toolForm.freeChargeReason);
      toolForm.freeChargePrice = "0.00";
      await updateOrder({
        freeOrderReason: toolForm.freeChargeReason,
        isFreeOrder: "YES",
      });
      await getOrderIdDetail(routeParams.orderId);
      // 关闭
      closeToolDialog(call);
      break;
  }
};

// 取消
const toolCancel = async () => {
  switch (toolDialogType.value) {
    case "freeCharge":
      // 免单
      toolForm.freeChargePrice = "";
      await updateOrder({
        freeOrderReason: "",
        isFreeOrder: "NO",
      });
      getOrderIdDetail(routeParams.orderId);
      break;
  }
};

// 关闭多功能弹窗
const closeToolDialog = (call) => {
  call();
  toolDialogRef.value.closeDialog();
};

// 修改上菜方式
const editDishesWay = (item) => {
  const index = chooseCarGoodsIndex.value;
  // 菜品
  if (!isEmpty.includes(index)) {
    addedToCart.value[index].serveDishesWay = item;

    const dishe = addedToCart.value[index];
    // 已下单
    if (dishe.orderType) {
      updateOrderDishes({ serveDishesWay: item, id: dishe.shopId });
    }
  } else {
    //订单
    routeParams.serveDishesWay = item;
    updateOrder({ serveDishesWay: item });
  }
};

// 修改订单信息
const updateOrder = async (params) => {
  await proxy.$storeDispatch("fetchEditOrderInfo", {
    ...params,
    id: routeParams.orderId,
  });
};

// 合并
const consolidateOrder = (params) => {
  proxy
    .$storeDispatch("fetchConsolidateOrder", {
      ...params,
      id: routeParams.orderId,
    })
    .then((res) => {
      proxy.$message({
        type: "success",
        message: proxy.$LANG_TEXT("合并成功"),
      });
      router.replace("/order");
    });
};

// 支付小费
const playTipApi = async (params) => {
  await proxy.$storeDispatch("fetchPayOrderTipping", {
    ...params,
    id: routeParams.orderId,
  });
};

// 发起分额
const sendPartialPay = (params) => {
  proxy
    .$storeDispatch("fetchInitiateOrderSharePay", {
      ...params,
      id: routeParams.orderId,
    })
    .then(() => {
      jumpPaypartial();
    });
};

// 取消订单
const cancelOrderApi = async (params) => {
  await proxy.$storeDispatch("fetchCancelingOrder", {
    id: routeParams.orderId,
    ...params,
  });
};

// 跳转 支付页面
const navigatoPayTo = (path, params) => {
  // 存放
  eatFoodModule.paymentDetails = {
    toolForm,
    goodsDetailed: goodsDetailed.value,
    getTotalOrderAmount: getTotalOrderAmount.value,
  };

  proxy.$navigateTo(path, params);
};

// 折扣数字键盘确认
const discountNumberConfirm = (call) => {
  call();
  toolDialogRef.value.closeDialog();
  // 更新订单信息
  updateOrder({
    cashDiscountMoney: toolForm.discount.cashDiscountMoney || 0,
    orderDiscount: "",
    orderDiscountType: "",
  });
};

/* 人数弹窗 */
// ref
const peopelDialogRef = ref();
// 人数数据
const peopelValue = ref('');
const peopelInputRef = ref(null)
const seatInputRef = ref(null)
// 标题
const peopelDialogTitles = {
  peopel: "修改人数",
  AA: "付款人数",
};
// 打开类型
const peopelType = ref("");
// 打开弹窗
const openPeopelDialog = (type) => {
  peopelType.value = type;
  // console.log('peopelType.value', peopelType.value);
  if (isActionOrder.value) {
    // AA付款
    if (type == "AA") {
      const { isInitiatePay, initiatePayStatus } = orderDetail.value;
      // 是否有进行中账单
      const status = ["NO_PAY", "IN_PAY"];
      if (status.includes(initiatePayStatus) && isInitiatePay == "YES") {
        jumpPayAA();
        return;
      }
    }

    // 赋值
    if (type == "peopel") {
      peopelValue.value = routeParams.peopleQuantity ? routeParams.peopleQuantity : '';
    }
    callerKeyboard.value = 'peopel'
    peopelDialogRef.value.openDialog();
    nextTick(() => {
      peopelInputRef.value.focus()
    })
  }
};

// 确认
const peopelDialogConfirm = () => {
  // 修改人数
  if (peopelType.value == "peopel") {
    if (peopelValue.value) {
      routeParams.peopleQuantity = peopelValue.value
    }
  }

  // 去AA付款
  if (peopelType.value == "AA") {
    jumpPayAA();
  }


  peopelDialogRef.value.closeDialog();
};

/* 座位弹窗 */
// ref
const seatDialogRef = ref();
const callerKeyboard = ref('')
// 座位数据
const seatValue = ref();
// 打开弹窗
const openSeatDialog = () => {
  callerKeyboard.value = 'seat'
  if (isActionOrder.value) {
    seatValue.value = routeParams.location;
    seatDialogRef.value.openDialog();
    nextTick(() => {
      seatInputRef.value.focus()
    })
  }
};
// 确认
const seatDialogConfirm = () => {
  if (seatValue.value) {
    routeParams.location = seatValue.value;
  }

  seatDialogRef.value.closeDialog();
};


const handleseatClose = () => {
  seatDialogRef.value.closeDialog();
}
const handlepeopelClose = () => {
  peopelDialogRef.value.closeDialog();
}
// 订单数据查询
// 数据
const stagingCarData = ref([]);
// 获取暂存购物单列表
const getTemporaryOrderShoppingList = async (id, getType) => {
  try {
    const res = await proxy.$storeDispatch(
      "fetchGetTemporaryOrderShoppingList",
      id
    );
    const result = res.result;
    stagingCarData.value = result;

    if (getType == "push") {
      setAddCarData(result);
    }
  } catch (error) { }
};
// 数据
const orderCarData = ref([]);
// 获取订单购物单列表
const getOrderShoppingList = async (id, getType) => {
  try {
    const res = await proxy.$storeDispatch("fetchGetOrderShoppingList", id);
    const result = res.result;
    orderCarData.value = result;

    // 是否存在已下单数据
    eatFoodModule.chooseOrderType = "orderCarData";

    if (getType == "push") {
      setAddCarData(result, "playOrder");
    }
  } catch (error) { }
};

// 赋值添加购物车数据
const setAddCarData = (result, type) => {
  // 赋值添加购物车数据
  setTimeout(() => {
    const addedCarDataResult = result.reduce((add, curr) => {
      return add.concat(toAddedCarData(curr.goodsList, type));
    }, []);
    const data = JSON.parse(JSON.stringify(addedCarDataResult));
    addedToCart.value.push(...data);
    // console.log(addedCarDataResult)
    // console.log(addedToCart)
  });
};

//接口数据 转 加入购物车本地数据
const toAddedCarData = (list, type) => {
  return list.map((item) => {
    const {
      // 自定义菜品
      customDishes,
      // 调味品
      dishesSpicesList = [],
      // 自定义调味品
      customDishesSpicesList,
      // 菜品信息
      dishes = {},
      stockCount,
      goodsId,
      id,
      dishesDiscount,
      dishesDiscountType,
      goodsQuantity,
      goodsPrice,
      goodsType,
      // 套餐
      setMeal,
      status,
      // 额外参数
      remark,
      serveDishesWay,
    } = item;

    const result = {
      orderType: type,
      goodsId,
      shopId: id,
      goodsQuantity,
      goodsPrice,
      dishesDiscount,
      dishesDiscountType,
      isDiscount: (dishes || {}).isDiscount,
      isTaxRate: (dishes || {}).isTaxRate,
      price: goodsPrice,
      stockCount,
      goodsType,
      status,
      remark,
      serveDishesWay,
    };

    // 调味品
    result.dishesSpicesList = dishesSpicesList;
    // 自定义调味品
    result.customDishesSpicesList = customDishesSpicesList;

    // DISHES:菜品、CUSTOM_DISHES:自定义菜品、SET_MEAL:套餐
    if (goodsType == "DISHES") {
      // 赋值
      dishes.price = goodsPrice;
      Object.assign(result, dishes);
    } else if (goodsType == "CUSTOM_DISHES") {
      const obj = customDishes || {};
      result.name = obj.name;
      result.orderShoppingGoodsId = obj.orderShoppingGoodsId;
      result.orderShoppingId = obj.orderShoppingId;
      result.price = obj.price;
    } else if (goodsType == "SET_MEAL") {
      Object.assign(result, setMeal);
      result.specificationList = setMeal.setMealSpecificationList.map((d) => {
        const child = d.setMealSpecificationDishesList;
        d.setMealSpecificationDishesList = child.map((e) => {
          e.id = e.dishesId;
          return e;
        });
        return d;
      });
      // console.log(result)
      // .map((d) => {
      // d.dishesList = d.setMealSpecificationDishesList;
      // 	return d;
      // });
    }

    // 菜品、套餐
    if (goodsType == "DISHES" || goodsType == "SET_MEAL") {
      // 当前规格列表 子级参数名
      const currSpecChildName =
        goodsType == "DISHES"
          ? "dishesSpecificationAttributeList"
          : "setMealSpecificationDishesList";
      // 规格数据
      const sureCarData =
        goodsType == "DISHES"
          ? result.dishesSpecificationList || []
          : result.specificationList || [];
      // 规格ID
      const dataIds = sureCarData.reduce((add, curr, index) => {
        const childs = curr[currSpecChildName];
        add.push(curr.id);
        const ids = childs.map((item) => item.id);
        return add.concat(ids);
      }, []);
      // 规格ID
      const condmentDataIds = result.dishesSpicesList.reduce(
        (add, curr, index) => {
          const childs = curr.dishesSpicesAttributeList;
          add.push(curr.id);
          const ids = childs.map((item) => item.id);
          return add.concat(ids);
        },
        []
      );
      //本地使用 唯一标识
      result.skuId = `${result.goodsId}-${dataIds.join("-") + "-" + condmentDataIds.join("-")
        }`;
    }

    // 打折金额
    result.discountPrice = proxy.$sumDisheDiscountPrice(result);

    // console.log(result);
    return result;
  });
};

// 订单可操作状态
const isActionOrder = computed(() => {
  const de = orderDetail.value || {};
  // AWAIT:待下单、UNDER_WAY:进行中
  const acs = ["AWAIT", "UNDER_WAY"];

  return !Object.keys(de).length || acs.includes(de.status);
});

// 订单详情
const orderDetail = ref({});
// 根据ID查询订单详情
const getOrderIdDetail = async (id) => {
  try {
    const res = await proxy.$storeDispatch("fetchGetOrderDetails", id);
    const result = res.result || {};
    const { initiatePayStatus, initiatePayType, isInitiatePay } = result;

    // 订单
    if (result.discountType == "ORDER") {
      result.cashDiscountMoney = 0;
    } else {
      //现金
      result.orderDiscount = 0;
      result.orderDiscountType = "";
    }

    orderDetail.value = result;

    const params = {
      type: "",
      peopleQuantity: "",
      location: "",
      userName: "",
      contactWay: "",
      address: "",
      remark: "",
      serveDishesWay: "",
      waiterName: "",
      isInitiatePay: "",
    };
    for (let i in params) {
      routeParams[i] = result[i];
    }
    routeParams.id = id;
    routeParams.orderId = id;
    routeParams.serveDishesWay = result.serveDishesWay || "";

    // 多功能表单
    toolForm.remark = result.remark || "";
    // 折扣
    toolForm.discount = {
      cashDiscountMoney: result.cashDiscountMoney,
      order: {
        orderDiscount: result.orderDiscount,
        orderDiscountType: result.orderDiscountType,
      },
      product: {
        dishesDiscount: "",
        dishesDiscountType: "",
      },
    };
    // 折扣类型
    toolForm.discountManner = result.discountManner || "ALL";

    // 抹零
    // 抹零options
    const notCountOpts = {
      NO: proxy.$LANG_TEXT("不抹"),
      YUAN: proxy.$LANG_TEXT("抹元"),
      ANGLE: proxy.$LANG_TEXT("抹角"),
      POINTS: proxy.$LANG_TEXT("抹分"),
    };
    toolForm.notCount = {
      maLingMoney: proxy.$erasurePrice(result.maLingMoney, result.maLingType),
      maLingType: result.maLingType,
      maLingText: notCountOpts[result.maLingType],
    };

    // 服务费
    toolForm.service = {
      serviceCharge: result.serviceCharge,
      serviceChargeType: result.serviceChargeType,
    };

    // 税率
    // 正确值
    if (!isEmpty.includes(result.taxRate)) {
      toolForm.taxRate = result.taxRate;
    } else {
      toolForm.taxRate = baseConfigInfo.value.taxRate;
    }

    // 免单
    toolForm.freeChargeReason = result.freeOrderReason;
    if (result.isFreeOrder == "YES") {
      toolForm.freeChargePrice = "0.00";
    }

    if (isActionOrder.value) {
      // 是否有进行中账单
      const status = ["NO_PAY", "IN_PAY"];
      if (status.includes(initiatePayStatus) && isInitiatePay == "YES") {
        paidPayDialogRef.value.openDialog();
      }
    } else {
      router.replace("/main");
    }

    console.log("查询订单详情", toolForm);
  } catch (error) { }
};

// 根据类型 判断状态显示 付款按钮
const getTypeStatusBtn = (type) => {
  const detail = orderDetail.value;

  const { initiatePayStatus, initiatePayType, isInitiatePay } = detail;
  // 类型 是否相同
  const isType = initiatePayType === type;
  // 是否是支付中、未支付
  const isPay = initiatePayStatus !== "YES_PAY";
  // 是否已发起支付
  const isSeocondPay = isInitiatePay === "YES";

  // console.log(type);
  // console.log(isInPay.value);
  // console.log(initiatePayType);
  // console.log(type);
  // console.log(isType);
  // console.log(isType, isPay, isSeocondPay);

  // 已发送支付
  if (isInitiatePay == "YES") {
    // 未发生状态
    if (!initiatePayStatus && !initiatePayType && !isSeocondPay) {
      return true;
    } else {
      //已发生
      // 订单支付
      if (isInPay.value) {
        return isType;
      } else {
        return isType && isPay && isSeocondPay;
      }
    }
  } else {
    //未发送支付
    // 堂食
    if (detail.type == "EAT_IN") {
      return true;
    } else {
      // 不为AA制
      if (type != "AA_PAY") {
        return true;
      } else {
        return false;
      }
    }
  }
};

// 订单支付进行中
const isInPay = computed(() => {
  // initiatePayType DIRECT_PAY:直接支付、AA_PAY:AA支付、SHARE_PAY:分额
  // initiatePayStatus NO_PAY:未支付、IN_PAY:支付中、YES_PAY:已支付
  const { initiatePayStatus, initiatePayType } = orderDetail.value;
  return initiatePayStatus && initiatePayType;
});

// ***********************************************************************************
// 计算 START
// ***********************************************************************************
//计算订单总金额
const getTotalOrderAmount = computed(() => {
  // priceType origin|pay
  // 原价|实付
  const baseInfo = baseConfigInfo.value;

  const list = addedToCart.value;

  // 数据源
  const originList = list.map((originItem) => {
    // 数量
    const quantity = originItem.goodsQuantity;
    // console.log(originItem);
    // 实付价格
    let payValue = 0;
    // 计算价格
    let res = 0;

    // 折扣总价
    let disCountPrice = 0;

    // 当前菜品单价
    const price = Number(originItem.price || 0);
    res += price;
    disCountPrice += price;

    // console.log(originItem);
    // 单个菜品折扣
    // 商品单价 * 商品折扣
    if (originItem.isDiscount == "YES") {
      const discountType = originItem.dishesDiscountType;
      const discount = originItem.dishesDiscount;
      if (discountType) {
        // 定额
        if (discountType == "QUOTA") {
          disCountPrice -= discount;
        } else {
          if (discount != 100) {
            const bdiscount = discount / 100;
            disCountPrice = bdiscount * disCountPrice;
          }
        }
      }
    }

    // 其他价格 -------------
    // 自定义调味品
    const customDishesPrice = (originItem.customDishesSpicesList || []).reduce(
      (add, item) => {
        return (add += item.price || 0);
      },
      0
    );
    res += customDishesPrice;

    // 调味品
    const condmentsPrice = (originItem.dishesSpicesList || []).reduce(
      (add, item) => {
        const childs = item.dishesSpicesAttributeList;
        const pRes = childs.reduce((chAdd, chItem) => {
          chAdd += chItem.price || 0;
          return chAdd;
        }, 0);
        add += pRes || 0;
        return add;
      },
      0
    );
    res += condmentsPrice;

    // 菜品
    if (originItem.goodsType === "DISHES") {
      // 规格
      const dishesSpecificationList = originItem.dishesSpecificationList || [];
      const spcePrice = dishesSpecificationList.reduce((add, item) => {
        const childs = item.dishesSpecificationAttributeList;
        const pRes = childs.reduce((chAdd, chItem) => {
          chAdd += chItem.price || 0;
          return chAdd;
        }, 0);
        add += pRes;
        return add;
      }, 0);
      res += spcePrice || 0;
    } else if (originItem.goodsType === "SET_MEAL") {
    } else if (originItem.goodsType === "CUSTOM_DISHES") {
    }

    // 单个菜品总价格
    // ( 商品单价+商品其他单价+（规格+调味品+自定义调味品）)* 商品数量
    const oneGoodsPrice = res * quantity;

    // // 是否免税 废弃
    // const isTaxRate = originItem.isTaxRate;
    // // 计算税率
    // if (isTaxRate == "NO") {
    // 	if (taxRate) {
    // 		const bdiscount = taxRate / 100;
    // 		oneGoodsPrice += bdiscount * oneGoodsPrice;
    // 	}
    // }

    // 单纯菜品总额
    payValue += oneGoodsPrice;

    // -普通单价 +折扣价
    originItem.payPrice = payValue - price + disCountPrice;
    originItem.originPrice = oneGoodsPrice;
    return originItem;
  });

  // 折扣
  const discount = toolForm.discount;
  // 类型
  const orderDiscountType = discount.order.orderDiscountType;
  // 订单折扣值
  const orderDiscountValue = discount.order.orderDiscount;
  // // 现金折扣
  const cashDiscountMoney = discount.cashDiscountMoney || 0;
  // 折扣类型
  // 所有商品 || 非折扣商品
  const discountManner = toolForm.discountManner;

  // console.log(originList);
  // 原价总计
  let originResult = originList.reduce((add, curr) => {
    return (add += curr.originPrice || 0);
  }, 0);

  // 实付 所有商品总价格
  let allPrice = originList.reduce((add, curr) => {
    return (add += curr.payPrice || 0);
  }, 0);

  // 实付价格总计
  let payResult = allPrice;

  // 已打折商品总价格
  let isDiscountPrice = originList
    .filter((dis) => dis.dishesDiscount)
    .reduce((add, curr) => {
      return (add += curr.payPrice || 0);
    }, 0);
  // 非折扣商品总价格
  let isNotDiscountPrice = originList
    .filter((dis) => !dis.dishesDiscount)
    .reduce((add, curr) => {
      return (add += curr.payPrice || 0);
    }, 0);

  // console.log(cashDiscountMoney || orderDiscountType);

  // console.log("--------");
  // console.log(discountManner);
  // console.log(payResult);

  // console.log(isNotDiscountPrice);
  // console.log(isDiscountPrice);
  // console.log("现金折扣", cashDiscountMoney);
  // console.log("类型", orderDiscountType);
  // console.log("订单折扣", orderDiscountValue);
  // console.log("--------");
  // 是否操作了 折扣
  if (cashDiscountMoney || orderDiscountType) {
    // 订单百分比
    if (orderDiscountType) {
      switch (discountManner) {
        case "ALL":
          // 实付 所有商品总价格 * 订单折扣
          if (orderDiscountValue) {
            allPrice = allPrice * (orderDiscountValue / 100);
          }
          payResult = allPrice;
          break;
        case "NOT_DISCOUNT":
          // 非折扣商品总价格 * 订单折扣
          if (orderDiscountValue) {
            isNotDiscountPrice =
              isNotDiscountPrice * (orderDiscountValue / 100);
          }

          // 加上已打折商品总价
          isNotDiscountPrice += isDiscountPrice;
          payResult = isNotDiscountPrice;
          break;
      }
    } else {
      //现金定额
      switch (discountManner) {
        case "ALL":
          allPrice -= cashDiscountMoney;

          payResult = allPrice;
          break;
        case "NOT_DISCOUNT":
          isNotDiscountPrice -= cashDiscountMoney;

          // 加上已打折商品总价
          isNotDiscountPrice += isDiscountPrice;
          payResult = isNotDiscountPrice;
          break;
      }
    }
  }
  // console.log(payResult);

  if (originResult) {
    if (routeParams.type == "TAKE_OUT") {
      const result = baseInfo.deliveryFee;
      // 外卖
      payResult += result;
      originResult += result;
    }

    // 计算服务费
    const service = toolForm.service;
    if (service.serviceChargeType) {
      // 定额
      if (service.serviceChargeType == "QUOTA") {
        payResult += service.serviceCharge;
        originResult += service.serviceCharge;
      } else {
        const bdiscount = service.serviceCharge / 100;
        payResult += bdiscount * payResult;
        originResult += bdiscount * originResult;
      }
    }

    // 计算税率
    const taxRate = toolForm.taxRate;
    if (taxRate) {
      const bdiscount = taxRate / 100;
      // console.log(originResult);
      // console.log(bdiscount);
      // console.log(bdiscount * originResult);
      // console.log(bdiscount * payResult);
      originResult += bdiscount * payResult;
      payResult += bdiscount * payResult;
    }

    // 计算小费
    const tip = toolForm.tip;
    payResult += tip.payAmount || 0;
  }

  // console.log(originResult);
  // console.log(payResult);

  // 遍历计算
  // 原价
  // 实付
  const total = {
    originPrice: originResult,
    payPrice: payResult,
  };
  for (let i in total) {
    const val = Number((total[i] || 0).toFixed(2));
    total[i] = val;
  }

  return total;
});

watch(
  () => getTotalOrderAmount.value.payPrice,
  (nVal) => {
    // console.log("抹零前");
    // console.log(nVal);
    toolForm.notCount.maLingMoney = proxy.$erasurePrice(
      nVal,
      toolForm.notCount.maLingType
    );
    // console.log("抹零后");
    // console.log(toolForm.notCount.maLingMoney);
  }
);

// 实付金额 (免单金额||抹零金额||支付金额)
const paidAmount = computed(
  () =>
    toolForm.freeChargePrice ||
    toolForm.notCount.maLingMoney ||
    getTotalOrderAmount.value.payPrice
);

// ***********************************************************************************
// 计算 END
// ***********************************************************************************

// ***********************************************************************************
// 支付 START
// ***********************************************************************************

// 您有一个账单正在支付中
// ref
const paidPayDialogRef = ref();
// 确认前往 支付
const paidPayGo = () => {
  const { initiatePayType } = orderDetail.value;

  switch (initiatePayType) {
    case "DIRECT_PAY":
      jumpDirectPay();
      break;
    case "AA_PAY":
      jumpPayAA();
      break;
    case "SHARE_PAY":
      jumpPaypartial();
      break;
  }
};
// 取消支付
const cancelPaidPay = async () => {
  const { orderId } = routeParams;
  // console.log(orderId);
  await proxy.$storeDispatch("fetchCancelOrderPay", { orderId });
  proxy.$message.success(proxy.$LANG_TEXT("取消成功"));
  paidPayDialogRef.value.closeDialog();
  init();
};

// 直接付款
const jumpDirectPay = () => {
  navigatoPayTo("/eatFoodDirectPayment", routeParams);
};
// AA付款
const jumpPayAA = () => {
  navigatoPayTo("/eatFoodPaymentAA", {
    ...routeParams,
    peopleQuantity: peopelValue.value,
  });
};
// 分额付款
const jumpPaypartial = () => {
  navigatoPayTo("/eatFoodPartialPay", routeParams);
};

// ***********************************************************************************
// 支付 END
// ***********************************************************************************

// ***********************************************************************************
// 表单 START
// ***********************************************************************************
// 客户基本信息
// ref
const customerDialogRef = ref();

// 信息
const customerData = reactive({
  userName: "",
  contactWay: "",
  address: "",
  waiterName: "",
});
// 打开客户信息弹窗
const openCustomerDialog = () => {
  if (routeParams.orderId) {
    proxy.$updateParams(customerData, orderDetail.value);
  } else {
    proxy.$updateParams(customerData, routeParams);
  }
  console.log('customerData', customerData)
  customerDialogRef.value.openDialog();
};

// 确认
const customerConfirm = async (result, call) => {
  // console.log(result,call)
  customerDialogRef.value.closeDialog();

  if (routeParams.orderId) {
    updateOrder(result);
  }
  proxy.$updateParams(routeParams, result);
  call();
};

// 其他弹窗
// ref
const otherDialogRef = ref();
// 打开弹窗
const openOtherDialog = () => {
  otherDialogRef.value.openDialog();
};
// 折扣弹窗
// ref
const discountDialogRef = ref();
// 打开折扣弹窗
const opendiscountDialog = () => {
  discountDialogRef.value.openDialog();
};
// 点击弹窗按钮
const handClickOtherBtn = (funCall, params) => {
  funCall(params);
  otherDialogRef.value.closeDialog();
};

// 更换服务员
// ref
const tableRef = ref();
const waiterNameDialogRef = ref();

// 打开表格加载
const openTableLoading = () => {
  tableRef.value.showLoading = true;
};

// 打开弹窗
const openWaiterNameDialog = () => {
  if (routeParams.orderId) {
    waiterNameDialogRef.value.openDialog();
    nextTick(() => {
      getTableList();
    });
  }
};

//打开更改类型的窗口
const typeChangeDialogRef = ref();
const openTypeChangeDialog = () => {
  typeChangeDialogRef.value.openDialog();
}
const typeChange = (value) => {
  console.log("type is selected is " + value);
  switch (value) {
    case "EAT_IN":
      routeParams.type = value;
      typeChangeDialogRef.value.closeDialog();
    case "TAKE_FOOD":
      routeParams.type = value;
      typeChangeDialogRef.value.closeDialog();
    case "TAKE_OUT":
      routeParams.type = value;
      typeChangeDialogRef.value.closeDialog();
  }
};
// 表格数据
const tableData = ref({});

const pageParams = reactive({
  pageNum: 1,
  pageSize: 10,
});
// 筛选表单数据
const filterParams = reactive({});

// 接收筛选栏的数据
const fetchFilterData = (params) => {
  for (let i in params) {
    filterParams[i] = params[i];
  }
  pageParams.pageNum = 1;
  getTableList();
};

watch([() => pageParams.pageNum, () => pageParams.pageSize], (nVal) => {
  getTableList();
});

// 模板数据
const templateData = [
  {
    type: "index",
    label: "编号",
    width: "100",
  },
  {
    prop: "name",
    label: "服务员",
    minWidth: "150",
  },
  {
    prop: "waiterType",
    label: "类型",
    showTemplate: true,
    minWidth: "150",
  },
];

// 查询表格列表数据
const getTableList = () => {
  const params = {
    ...pageParams,
    ...filterParams,
  };

  openTableLoading();

  proxy
    .$storeDispatch("fetchGetManageStaffUserListReporting", params)
    .then((res) => {
      tableData.value = res;
    });
};
// 单选服务员
const currentChangeWaiterName = (res) => {
  // 关闭窗口
  waiterNameDialogRef.value.closeDialog();
  if (routeParams.orderId) {
    const { id, name, waiterType } = res;
    // 修改订单
    updateOrder({
      waiterId: id,
      waiterName: name,
      waiterType,
    });
  }

  routeParams.waiterName = res.name;
};
// ***********************************************************************************
// 表单 END
// ***********************************************************************************

// 查询

// 查询小费列表
const getOrderTippingList = async () => {
  const orderId = routeParams.orderId;
  if (!orderId) {
    return;
  }
  const res = await proxy.$storeDispatch("fetchGetOrderTippingList", {
    orderId,
  });
  const result = res.result;
  const data = result[result.length - 1];
  if (data) {
    toolForm.tip = data;
  }
};
const keyboardName = ref('')
const formData = ref({})
// 初始查询
const init = async () => {
  // 查询顶部组合分类
  getSellDishesClassifyList();

  const id = routeQuery.orderId;
  // 从订单来
  if (id) {
    await getOrderIdDetail(id);
    // 已存在购物车数据||查询列表时已赋值类型
    if (addedToCart.value.length || eatFoodModule.chooseOrderType) {
      getTemporaryOrderShoppingList(id);
      getOrderShoppingList(id);
      return;
    }
    // 暂存
    getTemporaryOrderShoppingList(id, "push");
    // 订单
    getOrderShoppingList(id, "push");
  } else {
    for (let i in routeQuery) {
      routeParams[i] = routeQuery[i];
    }
    // 赋值默认税率
    toolForm.taxRate = baseConfigInfo.value.taxRate || 0;

  }

  // 查询小费
  getOrderTippingList();
};

// 跳转打印
const printJump = () => {
  router.push({ path: "/printMod", query: { orderId: routeParams.orderId } });
};

// 全局取消
const allHandCancel = () => {
  chooseCarGoodsIndex.value = "";
};

//打开备注键盘
const drawer = ref(false)
const handleClose = () => {
  drawer.value = false
  toolForm.remark = "";
}
const keyDown = (value) => {
  toolForm.remark = value;
  console.log(value);
  if (value) {
    value = value + '';
  }
  if (keyboardName.value === 'account') {
    formData.account = value
  } else {
    formData.password = value
  }
  if (peopelType.value === 'peopel') {
    peopelValue.value = value
  }
  if (callerKeyboard.value === 'seat') {
    seatValue.value = value
  }
}
// 表单值对应至键盘 2.3 Oneway
const openKeyboard = (tp) => {
  if (tp === 'peopel') {
    if (peopelValue.value) {
      keyDown(peopelValue.value)
    }
  } else if (tp === 'seat') {
    if (seatValue.value) {
      keyDown(seatValue.value)
    }
  }
}
const customerConfirmRemark = () => {
  drawer.value = false;
};
// fix index of dish choosen auto jump to new added dish
watch(
  () => addedToCart.value.length,
  (nVal) => {

    chooseCarGoodsIndex.value = nVal - 1;
  });
//provide below 2 to the child element of payment zizhen guo 01-25-2024
provide('price', getTotalOrderAmount);
provide('taxRate', goodsDetailed);
//检测是否自动付款
const checkOpenPaymentBox = () => {
  if (routeQuery.autoOpenPayment == 1) {
    openToolDialog('payment')
  };
};
setTimeout(checkOpenPaymentBox, 500);
onMounted(() => {
  init();
});
</script>

<style lang="scss" scoped>
$grayColor: #fdfdfd;

.eat-food-box {
  display: grid;
  grid-template-columns: 500px calc(100vw - 500px);
  height: 100%;
  user-select: none;

  .left-container {
    padding: 15px;
    background-color: $grayColor;

    .top-classify-box {
      position: sticky;
      top: 0px;
      z-index: 9;
      background-color: $grayColor;
    }

    .product-list-box {
      .product-list {
        //config how many products dispalyed in the menu by zizhen guo
        display: grid;
        grid-template-columns: auto auto auto auto auto;
        justify-content: left;
        align-items: center;
        justify-items: center;
        white-space: nowrap;
        overflow-x: auto;
        padding: 0 5px;
        box-sizing: border-box;
        margin-bottom: 350px;

        &:nth-last-child(1) {
          .product-item {
            padding-bottom: 0;
            padding-top: 10px;
          }
        }

        .product-item {
          width: 120px;
          height: 70px;
          display: inline-block;
          padding-bottom: 15px;
          margin-right: 5px;

          &:nth-last-child(1) {
            margin-right: 0;
          }
        }
      }

      .pagination {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
      }
    }
  }

  // 右侧购物车菜单
  .right-container {
    padding: 10px 30px;
    padding-right: 10px;
    box-sizing: border-box;
    height: 100%;
    overflow-y: auto;
    width: 100%;

    // 购物车
    .car-menu-box {
      .top-show-info {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        //grid-template-columns: repeat(3, 1fr);
        justify-content: space-between;
        row-gap: 5px;

        >div {
          width: auto;
          height: 40px;
          color: white;
          border-radius: 10px;
          line-height: 40px;
          text-align: center;
          box-shadow: 0px 0px 6px #0000001a;
          padding: 0 5px;
          min-width: 120px;
          max-width: 220px;

          &.peopel {
            background-color: #2b68fe;
          }

          &.intercept {
            background-color: #ffa001;
          }

          &.waiter {
            background-color: #f20808;
          }
        }
      }

      .car-container {
        margin-top: 15px;

        .table-theader {
          display: grid;
          grid-template-columns: 1fr 80px 120px 150px;
          border: 1px solid #f5f7fa;
          justify-items: center;
          border-radius: 10px;
          padding: 10px 0;

          p {
            width: 100%;
            text-align: center;

            &:nth-last-child(1) {
              text-align: left;
            }
          }
        }

        .content {
          box-shadow: 0px 2px 10px 0px #0000001a;
          border-radius: 10px;
          overflow: hidden;

          .table-list {
            height: 550px;
            font-size: 15px;
            overflow-y: auto;

            &.ml-scrollbar {
              &::-webkit-scrollbar {
                width: 15px;
              }
            }

            .list-item {
              // padding: 10px 0;
              transition: 300ms;

              .first-item {
                display: grid;
                flex-direction: row;
                flex-wrap: nowrap;
                grid-template-columns: 1fr 80px 120px 150px;
                justify-items: center;
                align-items: center;
              }

              .product-name {
                width: 100%;
                // overflow: hidden;
                padding-left: 10px;
                box-sizing: border-box;
                font-size: 16px;
                font-weight: 600;
                height: 30px;
                line-height: 40px;
              }

              .product-status {
                font-size: 13px;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                align-items: center;
                justify-content: center;
              }

              .product-price {
                width: 100%;

                >span {
                  font-size: 14px;
                  margin-left: 5px;

                  .icon-discount {
                    font-size: 14px;
                  }
                }
              }

              &.active {
                background-color: #0000001a;
              }
            }
          }

          .goods-detailed {
            line-height: 30px;
            font-size: 14px;
            padding-left: 15px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);

            .total-price {
              font-weight: bold;

              span {
                color: red;
              }
            }
          }

          .down-log {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            justify-items: center;
            padding: 10px 0;
            border-top: 1px solid #f5f7fa;

            &.log2 {
              grid-template-columns: 1fr 1fr 280px;
            }

            &.log3 {
              display: flex;
              padding: 10px;
            }
          }
        }
      }
    }

    .tool-btn-area {
      margin-top: 15px;
      width: 100%;

      .customMarign {

        >button,
        >div {
          width: 90%;
          height: 50px;
          margin-right: 15px;
          margin-bottom: 15px;
          margin-left: 0px;

          >button {
            width: 100%;
            height: 100%;
            margin: 0;
          }

          .el-dropdown {
            width: 100%;
            height: 100%;

            >button {
              width: 100%;
              height: 100%;
            }
          }
        }
      }

      .top-line {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        //grid-template-rows: repeat(2, 60px);
        justify-items: start;
        align-items: center;

        @extend .customMarign;
      }

      .bottom {


        .left {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(2, 60px);
          justify-items: start;
          align-items: center;
          @extend .customMarign;
        }

        .right {
          display: grid;
          grid-template-rows: 118px 1fr;
          justify-items: start;

          .playOrder {
            height: 108px;
          }

          @extend .customMarign;
        }
      }

      // > button,
      // > div {
      // 	margin-right: 15px;
      // 	margin-bottom: 15px;
      // 	margin-left: 0px;
      // }
    }
  }
}

.paid-pay {
  .tips {
    text-align: center;
    color: #f44336;
    padding: 20px 0;
  }
}

.ml-empty {
  height: 100%;
  box-sizing: border-box;
}

// 其他按钮弹窗
.other-btn-box {
  display: grid;
  grid-template-columns: repeat(2, 150px);
  justify-content: center;
  grid-template-rows: repeat(4, 60px);

  button {
    width: 95%;
    height: 90%;
    margin: 2.5%;
  }
}</style>
