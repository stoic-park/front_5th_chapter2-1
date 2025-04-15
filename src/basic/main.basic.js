import { products } from './const';

// 선택 요소, 추가 버튼, 장바구니 표시, 총 금액, 재고 정보
// TODO: DOM 요소 이름이 애매한데
var $select, $addButton, $cartDisplay, $sum, $stockInformation;

var lastSelectedProductId,
  bonusPoints = 0,
  totalPrice = 0,
  totalQuantity = 0;

// 메인 컴포넌트 렌더링 함수
function main() {
  console.log('메인 컴포넌트 렌더링 함수');
  // 요소 생성
  var root = document.getElementById('app');
  let container = document.createElement('div');
  let wrapper = document.createElement('div');
  let header = document.createElement('h1');

  // 요소 생성
  // TODO: 관심사끼리 그릅핑을 하자.
  $cartDisplay = document.createElement('div');
  $sum = document.createElement('div');
  $select = document.createElement('select');
  $addButton = document.createElement('button');
  $stockInformation = document.createElement('div');

  // 요소 id 설정
  $cartDisplay.id = 'cart-items';
  $sum.id = 'cart-total';
  $select.id = 'product-select';
  $addButton.id = 'add-to-cart';
  $stockInformation.id = 'stock-status';

  // style 추가
  container.className = 'bg-gray-100 p-8';
  wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  header.className = 'text-2xl font-bold mb-4';
  $sum.className = 'text-xl font-bold my-4';
  $select.className = 'border rounded p-2 mr-2';
  $addButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $stockInformation.className = 'text-sm text-gray-500 mt-2';

  // 텍스트 추가
  header.textContent = '장바구니';
  $addButton.textContent = '추가';

  // select 생성
  updateSelectOptions();

  // 요소 업데이트
  wrapper.appendChild(header);
  wrapper.appendChild($cartDisplay);
  wrapper.appendChild($sum);
  wrapper.appendChild($select);
  wrapper.appendChild($addButton);
  wrapper.appendChild($stockInformation);
  container.appendChild(wrapper);
  root.appendChild(container);

  // 계산
  calculateCart();

  // 랜덤 이벤트 설정
  setTimeout(function () {
    setInterprice(function () {
      var luckyItem = products[Math.floor(Math.random() * products.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelectOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  // 랜덤 이벤트 설정
  setTimeout(function () {
    setInterprice(function () {
      if (lastSelectedProductId) {
        var suggest = products.find(function (item) {
          return item.id !== lastSelectedProductId && item.quantity > 0;
        });
        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
          );
          suggest.price = Math.round(suggest.price * 0.95);
          updateSelectOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

// 선택 옵션 업데이트 함수
// 이벤트핸들러가 아니다
// updateSelOpts => updateSelectOptions
function updateSelectOptions() {
  // 선택 옵션 초기화
  $select.innerHTML = '';
  // 상품 목록 반복
  products.forEach(function (item) {
    // 옵션 생성
    var option = document.createElement('option');
    // 옵션 설정
    option.value = item.id;
    // 옵션 텍스트 설정
    option.textContent = item.name + ' - ' + item.price + '원';
    // 품절 옵션 비활성화
    if (item.quantity === 0) option.disabled = true;
    // 옵션 추가
    $select.appendChild(option);
  });
}

// 카드 계산 함수
// calcCart => calculateCart
function calculateCart() {
  // 총 금액 초기화
  totalPrice = 0;
  // 총 개수 초기화
  totalQuantity = 0;
  // 장바구니 아이템 목록
  var cartItems = $cartDisplay.children;
  // 총 금액 계산
  // subTot?
  var subTotal = 0;
  // 장바구니 아이템 목록 반복
  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      // 현재 아이템
      var currentItem;
      // 상품 목록 반복
      for (var j = 0; j < products.length; j++) {
        // 현재 아이템 찾기
        if (products[j].id === cartItems[i].id) {
          currentItem = products[j];
          break;
        }
      }
      // 현재 아이템 개수
      var quantity = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1],
      );
      // 현재 아이템 총 금액
      var itemTot = currentItem.price * quantity;
      // 할인 초기화
      var discount = 0;
      // 총 개수 증가
      totalQuantity += quantity;
      // 총 금액 증가
      subTotal += itemTot;
      // 10개 이상 구매 시 할인 적용
      if (quantity >= 10) {
        if (currentItem.id === 'p1') discount = 0.1;
        // 상품2 할인 적용
        else if (currentItem.id === 'p2') discount = 0.15;
        // 상품3 할인 적용
        else if (currentItem.id === 'p3') discount = 0.2;
        // 상품4 할인 적용
        else if (currentItem.id === 'p4') discount = 0.05;
        // 상품5 할인 적용
        else if (currentItem.id === 'p5') discount = 0.25;
      }
      // 총 금액 증가
      totalPrice += itemTot * (1 - discount);
    })();
  }
  // 할인 초기화
  let discountRate = 0;
  // 30개 이상 구매 시 할인 적용
  if (totalQuantity >= 30) {
    // 대량 할인 적용
    var bulkDiscount = totalPrice * 0.25;
    // 아이템 할인 적용
    var itemDiscount = subTot - totalPrice;
    // 대량 할인 적용
    if (bulkDiscount > itemDiscount) {
      totalPrice = subTotal * (1 - 0.25);
      discountRate = 0.25;
    } else {
      // 아이템 할인 적용
      discountRate = (subTotal - totalPrice) / subTotal;
    }
  }
  // 화요일 할인 적용
  else {
    discountRate = (subTotal - totalPrice) / subTotal;
  }
  // 화요일 할인 적용
  if (new Date().getDay() === 2) {
    totalPrice *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }
  // 총액 텍스트 설정
  $sum.textContent = '총액: ' + Math.round(totalPrice) + '원';
  // 할인 적용 시 할인 텍스트 설정
  if (discountRate > 0) {
    var $span = document.createElement('span');
    $span.className = 'text-green-500 ml-2';
    $span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    $sum.appendChild($span);
  }
  // 재고 정보 업데이트
  updateStockInformation();
  // 보너스 포인트 업데이트
  renderBonusPoints();
}

// 보너스 포인트 업데이트 함수
// renderBonusPts => renderBonusPoints
const renderBonusPoints = () => {
  // 보너스 포인트 계산
  bonusPoints = Math.floor(totalPrice / 1000);
  // 보너스 포인트 텍스트 설정
  var $bonusPointsTag = document.getElementById('loyalty-points');
  // 보너스 포인트 텍스트 존재 시
  if (!$bonusPointsTag) {
    // 보너스 포인트 텍스트 생성
    $bonusPointsTag = document.createElement('span');
    // 보너스 포인트 텍스트 id 설정
    $bonusPointsTag.id = 'loyalty-points';
    // 보너스 포인트 텍스트 class 설정
    $bonusPointsTag.className = 'text-blue-500 ml-2';
    // 보너스 포인트 텍스트 추가
    $sum.appendChild($bonusPointsTag);
  }
  // 보너스 포인트 텍스트 설정
  $bonusPointsTag.textContent = '(포인트: ' + bonusPoints + ')';
};

// 재고 정보 업데이트 함수
// updateStockInfo => updateStockInformation
function updateStockInformation() {
  // 재고 정보 초기화
  var informationMessage = '';
  // 상품 목록 반복
  products.forEach(function (item) {
    // 재고 부족 시 재고 정보 추가
    if (item.quantity < 5) {
      // 재고 정보 추가
      informationMessage +=
        item.name +
        ': ' +
        (item.quantity > 0
          ? '재고 부족 (' + item.quantity + '개 남음)'
          : '품절') +
        '\n';
    }
  });
  // 재고 정보 업데이트
  $stockInformation.textContent = informationMessage;
}

// 메인 함수 실행
main();

// TODO: 이벤트 핸들러
// 1. handle + target + action
// 2. function으로 작성

// 추가 버튼 클릭 이벤트 처리
$addButton.addEventListener('click', function () {
  // 선택 아이템 찾기
  var selectedItem = $select.value;
  // TODO: 화살표 함수로 수정
  var itemToAdd = products.find(function (item) {
    return item.id === selectedItem;
  });

  // 상품 존재 및 재고 있을 시
  if (itemToAdd && itemToAdd.quantity > 0) {
    // 상품 아이템 찾기
    var item = document.getElementById(itemToAdd.id);
    // 상품 아이템 존재 시
    if (item) {
      // 상품 아이템 개수 증가
      var newQuantity =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      // 상품 아이템 개수 증가 시 재고 있을 시
      if (newQuantity <= itemToAdd.quantity) {
        // 상품 아이템 텍스트 업데이트
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQuantity;
        itemToAdd.quantity--;
      } else {
        // 재고 부족 시 알림
        alert('재고가 부족합니다.');
      }
    } else {
      // 상품 아이템 생성
      var $newItem = document.createElement('div');
      // 상품 아이템 id 설정
      $newItem.id = itemToAdd.id;
      // 상품 아이템 class 설정
      $newItem.className = 'flex justify-between items-center mb-2';
      // 상품 아이템 텍스트 설정
      // TODO: 너무 길어서 알아보기 힘들다
      $newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      // 장바구니 아이템 추가
      $cartDisplay.appendChild($newItem);
      // 상품 아이템 재고 감소
      itemToAdd.quantity--;
    }
    // 카드 계산
    calculateCart();
    // 마지막 선택 아이템 설정
    lastSelectedProductId = selectedItem;
  }
});

// 장바구니 아이템 클릭 이벤트 처리
// TODO: 이벤트 핸들러 따로 빼자
$cartDisplay.addEventListener('click', function (event) {
  // 클릭 이벤트 타겟 설정
  var target = event.target;
  // 수량 변경 또는 삭제 버튼 클릭 시
  if (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  ) {
    // 상품 아이템 id 설정
    var productId = target.dataset.productId;
    // 상품 아이템 찾기
    var itemElement = document.getElementById(productId);
    // 상품 아이템 찾기
    var targetProduct = products.find(function (item) {
      return item.id === productId;
    });
    // 수량 변경 버튼 클릭 시
    if (target.classList.contains('quantity-change')) {
      // 수량 변경 값 설정
      var changedQuantity = parseInt(target.dataset.change);
      // 새로운 수량 계산
      var newQuantity =
        parseInt(itemElement.querySelector('span').textContent.split('x ')[1]) +
        changedQuantity;
      // 새로운 수량 있을 시
      if (
        newQuantity > 0 &&
        newQuantity <=
          targetProduct.quantity +
            parseInt(
              itemElement.querySelector('span').textContent.split('x ')[1],
            )
      ) {
        // 상품 아이템 텍스트 업데이트
        itemElement.querySelector('span').textContent =
          itemElement.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQuantity;
        // 상품 아이템 재고 감소
        targetProduct.quantity -= changedQuantity;
      }
      // 수량 0 이하 시
      else if (newQuantity <= 0) {
        // 상품 아이템 삭제
        itemElement.remove();
        // 상품 아이템 재고 감소
        targetProduct.quantity -= changedQuantity;
      }
      // 재고 부족 시 알림
      else {
        alert('재고가 부족합니다.');
      }
    }
    // 삭제 버튼 클릭 시
    else if (target.classList.contains('remove-item')) {
      // 상품 아이템 수량 설정
      var removedQuantity = parseInt(
        itemElement.querySelector('span').textContent.split('x ')[1],
      );
      // 상품 아이템 재고 증가
      targetProduct.quantity += removedQuantity;
      // 상품 아이템 삭제
      itemElement.remove();
    }
    // 카드 계산
    calculateCart();
  }
});
