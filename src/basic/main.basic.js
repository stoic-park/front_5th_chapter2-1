// TODO: 함수 네이밍 수정 필요
// TODO: 변수 네이밍 수정 필요
// TODO: 함수 실행 위치 고려해서 위치 변경
// 변수 선언
var prodList, sel, addBtn, cartDisp, sum, stockInfo;
var lastSel,
  bonusPts = 0,
  totalAmt = 0,
  itemCnt = 0;

// 메인 컴포넌트 렌더링 함수
function main() {
  prodList = [
    { id: 'p1', name: '상품1', val: 10000, q: 50 },
    { id: 'p2', name: '상품2', val: 20000, q: 30 },
    { id: 'p3', name: '상품3', val: 30000, q: 20 },
    { id: 'p4', name: '상품4', val: 15000, q: 0 },
    { id: 'p5', name: '상품5', val: 25000, q: 10 },
  ];

  // 요소 생성
  var root = document.getElementById('app');
  let cont = document.createElement('div');
  var wrap = document.createElement('div');
  let hTxt = document.createElement('h1');

  // 요소 생성
  cartDisp = document.createElement('div');
  sum = document.createElement('div');
  sel = document.createElement('select');
  addBtn = document.createElement('button');
  stockInfo = document.createElement('div');

  // 요소 설정 - id 설정
  cartDisp.id = 'cart-items';
  sum.id = 'cart-total';
  sel.id = 'product-select';
  addBtn.id = 'add-to-cart';
  stockInfo.id = 'stock-status';

  // 요소 설정 - class 설정
  cont.className = 'bg-gray-100 p-8';
  wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  hTxt.className = 'text-2xl font-bold mb-4';
  sum.className = 'text-xl font-bold my-4';
  sel.className = 'border rounded p-2 mr-2';
  addBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockInfo.className = 'text-sm text-gray-500 mt-2';

  // 요소 설정 - 텍스트 설정
  hTxt.textContent = '장바구니';
  addBtn.textContent = '추가';

  // 요소 추가
  updateSelOpts();
  wrap.appendChild(hTxt);
  wrap.appendChild(cartDisp);
  wrap.appendChild(sum);
  wrap.appendChild(sel);
  wrap.appendChild(addBtn);
  wrap.appendChild(stockInfo);
  cont.appendChild(wrap);
  root.appendChild(cont);

  // 카드 계산
  calcCart();

  // 랜덤 이벤트 설정
  setTimeout(function () {
    setInterval(function () {
      var luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
      if (Math.random() < 0.3 && luckyItem.q > 0) {
        luckyItem.val = Math.round(luckyItem.val * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);

  // 랜덤 이벤트 설정
  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        var suggest = prodList.find(function (item) {
          return item.id !== lastSel && item.q > 0;
        });
        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          suggest.val = Math.round(suggest.val * 0.95);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

// 선택 옵션 업데이트 함수
function updateSelOpts() {
  // 선택 옵션 초기화
  sel.innerHTML = '';
  // 상품 목록 반복
  prodList.forEach(function (item) {
    // 옵션 생성
    var opt = document.createElement('option');
    // 옵션 설정
    opt.value = item.id;
    opt.textContent = item.name + ' - ' + item.val + '원';
    // 품절 옵션 비활성화
    if (item.q === 0) opt.disabled = true;
    // 옵션 추가
    sel.appendChild(opt);
  });
}

// 카드 계산 함수
function calcCart() {
  // 총 금액 초기화
  totalAmt = 0;
  // 총 개수 초기화
  itemCnt = 0;
  // 장바구니 아이템 목록
  var cartItems = cartDisp.children;
  // 총 금액 계산
  var subTot = 0;
  // 장바구니 아이템 목록 반복
  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      // 현재 아이템
      var curItem;
      // 상품 목록 반복
      for (var j = 0; j < prodList.length; j++) {
        // 현재 아이템 찾기
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }
      // 현재 아이템 개수
      var q = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1]
      );
      // 현재 아이템 총 금액
      var itemTot = curItem.val * q;
      // 할인 초기화
      var disc = 0;
      // 총 개수 증가
      itemCnt += q;
      // 총 금액 증가
      subTot += itemTot;
      // 10개 이상 구매 시 할인 적용
      if (q >= 10) {
        if (curItem.id === 'p1') disc = 0.1;
        // 상품2 할인 적용
        else if (curItem.id === 'p2') disc = 0.15;
        // 상품3 할인 적용
        else if (curItem.id === 'p3') disc = 0.2;
        // 상품4 할인 적용
        else if (curItem.id === 'p4') disc = 0.05;
        // 상품5 할인 적용
        else if (curItem.id === 'p5') disc = 0.25;
      }
      // 총 금액 증가
      totalAmt += itemTot * (1 - disc);
    })();
  }
  // 할인 초기화
  let discRate = 0;
  // 30개 이상 구매 시 할인 적용
  if (itemCnt >= 30) {
    // 대량 할인 적용
    var bulkDisc = totalAmt * 0.25;
    // 아이템 할인 적용
    var itemDisc = subTot - totalAmt;
    // 대량 할인 적용
    if (bulkDisc > itemDisc) {
      totalAmt = subTot * (1 - 0.25);
      discRate = 0.25;
    } else {
      // 아이템 할인 적용
      discRate = (subTot - totalAmt) / subTot;
    }
  }
  // 화요일 할인 적용
  else {
    discRate = (subTot - totalAmt) / subTot;
  }
  // 화요일 할인 적용
  if (new Date().getDay() === 2) {
    totalAmt *= 1 - 0.1;
    discRate = Math.max(discRate, 0.1);
  }
  // 총액 텍스트 설정
  sum.textContent = '총액: ' + Math.round(totalAmt) + '원';
  // 할인 적용 시 할인 텍스트 설정
  if (discRate > 0) {
    var span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discRate * 100).toFixed(1) + '% 할인 적용)';
    sum.appendChild(span);
  }
  // 재고 정보 업데이트
  updateStockInfo();
  // 보너스 포인트 업데이트
  renderBonusPts();
}
// 보너스 포인트 업데이트 함수
const renderBonusPts = () => {
  // 보너스 포인트 계산
  bonusPts = Math.floor(totalAmt / 1000);
  // 보너스 포인트 텍스트 설정
  var ptsTag = document.getElementById('loyalty-points');
  // 보너스 포인트 텍스트 존재 시
  if (!ptsTag) {
    // 보너스 포인트 텍스트 생성
    ptsTag = document.createElement('span');
    // 보너스 포인트 텍스트 id 설정
    ptsTag.id = 'loyalty-points';
    // 보너스 포인트 텍스트 class 설정
    ptsTag.className = 'text-blue-500 ml-2';
    // 보너스 포인트 텍스트 추가
    sum.appendChild(ptsTag);
  }
  // 보너스 포인트 텍스트 설정
  ptsTag.textContent = '(포인트: ' + bonusPts + ')';
};

// 재고 정보 업데이트 함수
function updateStockInfo() {
  // 재고 정보 초기화
  var infoMsg = '';
  // 상품 목록 반복
  prodList.forEach(function (item) {
    // 재고 부족 시 재고 정보 추가
    if (item.q < 5) {
      // 재고 정보 추가
      infoMsg +=
        item.name +
        ': ' +
        (item.q > 0 ? '재고 부족 (' + item.q + '개 남음)' : '품절') +
        '\n';
    }
  });
  // 재고 정보 업데이트
  stockInfo.textContent = infoMsg;
}

// 메인 함수 실행
main();

// 추가 버튼 클릭 이벤트 처리
addBtn.addEventListener('click', function () {
  // 선택 아이템 찾기
  var selItem = sel.value;
  // 상품 목록 반복
  var itemToAdd = prodList.find(function (p) {
    return p.id === selItem;
  });

  // 상품 존재 및 재고 있을 시
  if (itemToAdd && itemToAdd.q > 0) {
    // 상품 아이템 찾기
    var item = document.getElementById(itemToAdd.id);
    // 상품 아이템 존재 시
    if (item) {
      // 상품 아이템 개수 증가
      var newQty =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      // 상품 아이템 개수 증가 시 재고 있을 시
      if (newQty <= itemToAdd.q) {
        // 상품 아이템 텍스트 업데이트
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.val + '원 x ' + newQty;
        itemToAdd.q--;
      } else {
        // 재고 부족 시 알림
        alert('재고가 부족합니다.');
      }
    } else {
      // 상품 아이템 생성
      var newItem = document.createElement('div');
      // 상품 아이템 id 설정
      newItem.id = itemToAdd.id;
      // 상품 아이템 class 설정
      newItem.className = 'flex justify-between items-center mb-2';
      // 상품 아이템 텍스트 설정
      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.val +
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
      cartDisp.appendChild(newItem);
      // 상품 아이템 재고 감소
      itemToAdd.q--;
    }
    // 카드 계산
    calcCart();
    // 마지막 선택 아이템 설정
    lastSel = selItem;
  }
});

// 장바구니 아이템 클릭 이벤트 처리
cartDisp.addEventListener('click', function (event) {
  // 클릭 이벤트 타겟 설정
  var tgt = event.target;
  // 수량 변경 또는 삭제 버튼 클릭 시
  if (
    tgt.classList.contains('quantity-change') ||
    tgt.classList.contains('remove-item')
  ) {
    // 상품 아이템 id 설정
    var prodId = tgt.dataset.productId;
    // 상품 아이템 찾기
    var itemElem = document.getElementById(prodId);
    // 상품 아이템 찾기
    var prod = prodList.find(function (p) {
      return p.id === prodId;
    });
    // 수량 변경 버튼 클릭 시
    if (tgt.classList.contains('quantity-change')) {
      // 수량 변경 값 설정
      var qtyChange = parseInt(tgt.dataset.change);
      // 새로운 수량 계산
      var newQty =
        parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) +
        qtyChange;
      // 새로운 수량 있을 시
      if (
        newQty > 0 &&
        newQty <=
          prod.q +
            parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
      ) {
        // 상품 아이템 텍스트 업데이트
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQty;
        // 상품 아이템 재고 감소
        prod.q -= qtyChange;
      }
      // 수량 0 이하 시
      else if (newQty <= 0) {
        // 상품 아이템 삭제
        itemElem.remove();
        // 상품 아이템 재고 감소
        prod.q -= qtyChange;
      }
      // 재고 부족 시 알림
      else {
        alert('재고가 부족합니다.');
      }
    }
    // 삭제 버튼 클릭 시
    else if (tgt.classList.contains('remove-item')) {
      // 상품 아이템 수량 설정
      var remQty = parseInt(
        itemElem.querySelector('span').textContent.split('x ')[1]
      );
      // 상품 아이템 재고 증가
      prod.q += remQty;
      // 상품 아이템 삭제
      itemElem.remove();
    }
    // 카드 계산
    calcCart();
  }
});
