import { products } from './const';

// 선택 요소, 추가 버튼, 장바구니 표시, 총 금액, 재고 정보

var $select, $addButton, $cartDisplay, $sum, $stockInformation;

// FIXME: var -> let, const 로 변경
var lastSelectedProductId,
    bonusPoints = 0,
    totalPrice = 0,
    totalQuantity = 0;

//FIXME: DOM 생성 함수 추출하기
/**
 * DOM 요소를 생성 함수
 * @param {string} tagName - 생성할 HTML 태그 이름
 * @param {Object} options - 요소 설정 옵션
 * @param {string} [options.id] - 요소의 ID
 * @param {string} [options.className] - 요소의 클래스 이름
 * @param {string} [options.textContent] - 요소의 텍스트 내용
 * @param {string} [options.innerHTML] - 요소의 HTML 내용
 * @param {Array} [options.children] - 추가할 자식 요소 배열
 * @param {Object} [options.attributes] - 추가할 속성 객체 (key-value 쌍)
 * @param {Function} [options.onClick] - 클릭 이벤트 핸들러
 * @returns {HTMLElement} 생성된 DOM 요소
 */

function createDOM(tagName, options = {}) {
    // 요소 생성
    const element = document.createElement(tagName);

    // ID 설정
    if (options.id) {
        element.id = options.id;
    }

    // 클래스 설정
    if (options.className) {
        element.className = options.className;
    }

    // 텍스트 설정
    if (options.textContent) {
        element.textContent = options.textContent;
    }

    // HTML 내용 설정
    if (options.innerHTML) {
        element.innerHTML = options.innerHTML;
    }

    // 추가 속성 설정
    if (options.attributes) {
        Object.entries(options.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }

    // 이벤트 핸들러 설정
    if (options.onClick) {
        element.addEventListener('click', options.onClick);
    }

    // 자식 요소 추가
    if (options.children && Array.isArray(options.children)) {
        options.children.forEach((child) => {
            if (child) {
                element.appendChild(child);
            }
        });
    }

    return element;
}

/**
 * 메인 컴포넌트 생성 함수
 */

function main() {
    // FIXME: 레이아웃 생성하는 함수를 따로 추출
    // 요소 생성
    var root = document.getElementById('app');

    // 컨테이너 생성
    const container = createDOM('div', {
        className: 'bg-gray-100 p-8',
    });

    // 래퍼 생성
    const wrapper = createDOM('div', {
        className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
    });

    // 헤더 생성
    const header = createDOM('h1', {
        className: 'text-2xl font-bold mb-4',
        textContent: '장바구니',
    });

    // 장바구니 할당
    $cartDisplay = createDOM('div', {
        id: 'cart-items',
    });

    // 총액 할당
    $sum = createDOM('div', {
        id: 'cart-total',
        className: 'text-xl font-bold my-4',
    });

    // 상품 선택 할당
    $select = createDOM('select', {
        id: 'product-select',
        className: 'border rounded p-2 mr-2',
    });

    // 추가 버튼 할당
    $addButton = createDOM('button', {
        id: 'add-to-cart',
        className: 'bg-blue-500 text-white px-4 py-2 rounded',
        textContent: '추가',
    });

    // 재고 정보 할당
    $stockInformation = createDOM('div', {
        id: 'stock-status',
        className: 'text-sm text-gray-500 mt-2',
    });

    // 요소 초기 렌더링
    wrapper.appendChild(header);
    wrapper.appendChild($cartDisplay);
    wrapper.appendChild($sum);
    wrapper.appendChild($select);
    wrapper.appendChild($addButton);
    wrapper.appendChild($stockInformation);
    container.appendChild(wrapper);
    root.appendChild(container);

    // 추가 버튼 이벤트 처리
    $addButton = document.getElementById('add-to-cart');
    $addButton.addEventListener('click', handleCartAdd);

    $cartDisplay = document.getElementById('cart-items');
    $cartDisplay.addEventListener('click', handleCartItemClick);

    // select options 최신화
    updateSelectOptions();
    // 계산
    calculateCart();

    // FIXME: 랜덤 딜레이 이벤트 발생 함수 추출하기!
    // 랜덤 딜레이 이벤트 발생 함수
    const scheduleRandomEvent = (eventHandler, interval, randomDelay) => {
        const delay = Math.random() * randomDelay;
        setTimeout(() => {
            setInterval(eventHandler, interval);
        }, delay);
    };

    // 번개 세일 함수
    const applyFlashSale = () => {
        var luckyItem = products[Math.floor(Math.random() * products.length)];
        if (Math.random() < 0.3 && luckyItem.quantity > 0) {
            luckyItem.price = Math.round(luckyItem.price * 0.8);
            alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
            updateSelectOptions();
        }
    };

    // 추천 상품 세일 함수
    const applyRecommendationSale = () => {
        if (lastSelectedProductId) {
            var suggest = products.find(function (item) {
                return item.id !== lastSelectedProductId && item.quantity > 0;
            });
            if (suggest) {
                alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
                suggest.price = Math.round(suggest.price * 0.95);
                updateSelectOptions();
            }
        }
    };

    // 번개 세일 이벤트 스케줄링
    scheduleRandomEvent(applyFlashSale, 30000, 10000);
    // 추천 상품 세일 이벤트 스케줄링
    scheduleRandomEvent(applyRecommendationSale, 60000, 20000);
}

// FIXME: 선택 옵션 업데이트 함수 추출하기!
/**
 * 상품 옵션 요소를 생성하는 함수
 * @param {Object} product - 상품 정보 객체
 */
function createProductOption(product) {
    // 옵션 생성
    var option = document.createElement('option');
    // 옵션 설정
    option.value = product.id;
    // 옵션 텍스트 설정
    option.textContent = product.name + ' - ' + product.price + '원';
    // 품절 옵션 비활성화
    if (product.quantity === 0) option.disabled = true;
    // 옵션 추가
    $select.appendChild(option);
}

/**
 * 선택 옵션 업데이트 함수
 */
function updateSelectOptions() {
    // 선택 옵션 초기화
    $select.innerHTML = '';
    // 상품 목록 반복
    products.forEach(createProductOption);
}

/**
 * 장바구니 총 금액 계산 함수
 */
function calculateCart() {
    // 총 금액 초기화
    totalPrice = 0;
    // 총 개수 초기화
    totalQuantity = 0;
    // 장바구니 아이템 목록
    var cartItems = $cartDisplay.children;
    // 총 금액 계산
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
            var quantity = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
            // 현재 아이템 총 금액
            var beforeDiscountPrice = currentItem.price * quantity;
            // 할인 초기화
            var discountRate = 0;
            // 총 개수 증가
            totalQuantity += quantity;
            // 총 금액 증가
            subTotal += beforeDiscountPrice;
            // 10개 이상 구매 시 할인 적용
            if (quantity >= 10) {
                // FIXME: 할인율과 같은 고정 값은 상수로 빼자
                if (currentItem.id === 'p1') discountRate = 0.1;
                else if (currentItem.id === 'p2') discountRate = 0.15;
                else if (currentItem.id === 'p3') discountRate = 0.2;
                else if (currentItem.id === 'p4') discountRate = 0.05;
                else if (currentItem.id === 'p5') discountRate = 0.25;
            }
            // 총 금액 계산
            totalPrice += beforeDiscountPrice * (1 - discountRate);
        })();
    }
    // 할인 초기화
    let discountRate = 0;
    // 30개 이상 구매 시 할인 적용
    if (totalQuantity >= 30) {
        // 대량 할인 적용
        var bulkDiscount = totalPrice * 0.25;
        // 아이템 할인 적용
        var itemDiscount = subTotal - totalPrice;
        // 대량 할인 적용
        if (bulkDiscount > itemDiscount) {
            totalPrice = subTotal * (1 - 0.25);
            discountRate = 0.25;
        } else {
            // 아이템 할인 적용
            discountRate = (subTotal - totalPrice) / subTotal;
        }
    } else {
        discountRate = (subTotal - totalPrice) / subTotal;
    }
    // 깜짝 화요일 할인 적용
    if (new Date().getDay() === 2) {
        totalPrice *= 1 - 0.1;
        discountRate = Math.max(discountRate, 0.1);
    }

    // 총액 텍스트 설정
    $sum.textContent = '총액: ' + Math.round(totalPrice) + '원';
    // 할인 적용 시 할인 텍스트 설정
    if (discountRate > 0) {
        const $totalPrice = createDOM('span', {
            className: 'text-green-500 ml-2',
            textContent: '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)',
        });
        $sum.appendChild($totalPrice);
    }
    // 재고 정보 업데이트
    updateStockInformation();
    // 보너스 포인트 업데이트
    renderBonusPoints();
}

/**
 * 장바구니 아이템 생성 함수
 */
function createCartItem(product) {
    const $cartDisplay = document.getElementById('cart-items');
    var $newItem = document.createElement('div');
    // 상품 아이템 id 설정
    $newItem.id = product.id;
    // 상품 아이템 class 설정
    $newItem.className = 'flex justify-between items-center mb-2';
    // 상품 아이템 텍스트 설정
    $newItem.innerHTML =
        '<span>' +
        product.name +
        ' - ' +
        product.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        product.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        product.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        product.id +
        '">삭제</button></div>';
    // 장바구니 아이템 추가
    $cartDisplay.appendChild($newItem);
}
/**
 * 보너스 포인트 렌더링 함수
 *
 * TODO: const $bonusPointsTag.. 를 사용할 경우 스코프 문제가 발생할 수 있으니 주의!!
 */
const renderBonusPoints = () => {
    // 보너스 포인트 계산
    bonusPoints = Math.floor(totalPrice / 1000);
    // 보너스 포인트 텍스트 설정
    var $bonusPointsTag = document.getElementById('loyalty-points');
    // 보너스 포인트 텍스트 존재 시
    if (!$bonusPointsTag) {
        $bonusPointsTag = createDOM('span', {
            id: 'loyalty-points',
            className: 'text-blue-500 ml-2',
        });
        // 보너스 포인트 텍스트 추가
        $sum.appendChild($bonusPointsTag);
    }
    // 보너스 포인트 텍스트 설정
    $bonusPointsTag.textContent = '(포인트: ' + bonusPoints + ')';
};

/**
 * 재고 정보 업데이트 함수
 */
function updateStockInformation() {
    const $stockInformation = document.getElementById('stock-status');
    var informationMessage = '';
    products.forEach(function (item) {
        // 재고 부족 시 재고 정보 추가
        if (item.quantity < 5) {
            // 재고 정보 추가
            informationMessage +=
                item.name + ': ' + (item.quantity > 0 ? '재고 부족 (' + item.quantity + '개 남음)' : '품절') + '\n';
        }
    });
    // 재고 정보 업데이트
    $stockInformation.textContent = informationMessage;
}

// 메인 함수 실행
main();

/**
 * 추가 버튼 클릭 이벤트 처리
 */
function handleCartAdd() {
    const $select = document.getElementById('product-select');
    // 선택 아이템 찾기
    var selectedProductId = $select.value;
    var selectedProduct = products.find(function (item) {
        return item.id === selectedProductId;
    });

    // 상품 존재 및 재고 있을 시
    if (selectedProduct && selectedProduct.quantity > 0) {
        // 상품 아이템 찾기
        var $cartItem = document.getElementById(selectedProduct.id);
        // 상품 아이템 존재 시
        if ($cartItem) {
            // 상품 아이템 개수 증가
            var newQuantity = parseInt($cartItem.querySelector('span').textContent.split('x ')[1]) + 1;
            // 상품 아이템 개수 증가 시 재고 있을 시
            if (newQuantity <= selectedProduct.quantity) {
                // 상품 아이템 텍스트 업데이트
                $cartItem.querySelector('span').textContent =
                    selectedProduct.name + ' - ' + selectedProduct.price + '원 x ' + newQuantity;
                selectedProduct.quantity--;
            } else {
                // 재고 부족 시 알림
                alert('재고가 부족합니다.');
            }
        } else {
            // 장바구니 아이템 생성
            createCartItem(selectedProduct);
            // 상품 아이템 재고 감소
            selectedProduct.quantity--;
        }
        // 카드 계산
        calculateCart();
        // 마지막 선택 아이템 설정
        lastSelectedProductId = selectedProductId;
    }
}

/**
 * 장바구니 아이템 클릭 이벤트 처리
 */
function handleCartItemClick(event) {
    var target = event.target;
    // 수량 변경 또는 삭제 버튼 클릭 시
    if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
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
            var newQuantity = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]) + changedQuantity;
            // 새로운 수량 있을 시
            if (
                newQuantity > 0 &&
                newQuantity <=
                    targetProduct.quantity + parseInt(itemElement.querySelector('span').textContent.split('x ')[1])
            ) {
                // 상품 아이템 텍스트 업데이트
                itemElement.querySelector('span').textContent =
                    itemElement.querySelector('span').textContent.split('x ')[0] + 'x ' + newQuantity;
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
            var removedQuantity = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);
            // 상품 아이템 재고 증가
            targetProduct.quantity += removedQuantity;
            // 상품 아이템 삭제
            itemElement.remove();
        }
        // 카트 렌더링
        calculateCart();
    }
}
